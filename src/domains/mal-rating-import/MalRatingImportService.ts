import { RatingsImportItem } from "@prisma/client"
import axios from "axios"
import { JSDOM } from "jsdom"
import puppeteer from "puppeteer"
import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "routing-controllers"
import { RatingsImportRepository } from "../../rating-import/RatingsImportRepository"
import { kafkaTopics } from "../../utils/kafka/kafkaTopics"
import { myKafka } from "../../utils/kafka/myKafka"
import { urls } from "../../utils/urls"
import { GoogleSearchService } from "../google-search/GoogleSearchService"
import { NotificationService } from "../notification/NotificationService"
import { RatingRepository } from "../rating/RatingRepository"
import { SyncroItemRepository } from "../syncro-item/SyncroItemRepository"

export class MalRatingImportService {
  constructor(
    private kafka = myKafka,
    private importRepository = new RatingsImportRepository(),
    private myAxios = axios.create(),
    private googleSearchService = new GoogleSearchService(),
    private itemRepo = new SyncroItemRepository(),
    private notificationService = new NotificationService(),
    private ratingRepository = new RatingRepository()
  ) {}

  async checkMalUser(username: string, requesterId: string) {
    await this._checkAlreadyRatedThisWeek(requesterId)

    username = username.trim()

    const url = urls.malProfile(username)
    const response = await this.myAxios.get(url).catch((e) => {
      if (e.response.status === 404) {
        throw new NotFoundError("User not found on MAL")
      }
      throw new InternalServerError(e.message)
    })

    const dom = new JSDOM(response.data)
    const div = dom.window.document.querySelector(".user-image")
    const imageUrl = div?.querySelector("img")?.getAttribute("src") || ""

    return {
      username,
      url,
    }
  }

  async startAnimeImport(requesterId: string, username: string) {
    await this._checkAlreadyRatedThisWeek(requesterId)

    const animeTitlesUrls = await this._getAnimesViaPuppeteer(username).catch(
      (e) => {
        // TODO feat/clbz1fkvh81940m1xb8qxcftw
        throw e
      }
    )

    const newImportRequest = await this.importRepository.createRatingImportRequest(
      requesterId,
      animeTitlesUrls.length
    )

    const newImportItems = await this.importRepository.createImportItems({
      items: animeTitlesUrls,
      requesterId: requesterId,
      importRequestId: newImportRequest.id,
    })

    this._produceKafkaMessages(newImportItems)
    return true
  }

  async _checkAlreadyRatedThisWeek(requesterId: string) {
    const alreadyRatedThisWeek = await this.importRepository.alreadyImportedThisWeek(
      requesterId,
      "MyAnimeList"
    )
    if (alreadyRatedThisWeek)
      throw new ForbiddenError("You already rated this week.")
  }

  async _getAnimesViaPuppeteer(username: string) {
    const browser = await puppeteer.launch({
      // devtools: true, //
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
    )
    await page.setViewport({ width: 1000, height: 1000 })

    await page.goto(urls.malUserAnimeList(username))

    await page.waitForSelector("table")

    const validAnimes = await page.evaluate(() => {
      const htmlTable = document.querySelector("table")
      if (!htmlTable) return []
      const htmlTrs = htmlTable.querySelectorAll("tr")
      const animes = Array.from(htmlTrs).map((htmlTr) => {
        const title = htmlTr.querySelector("td.title")?.textContent
        const score = Number(htmlTr.querySelector("td.score")?.textContent)

        const a: HTMLAnchorElement | null = htmlTr.querySelector("td.title a")
        const url = a?.href

        if (!title || !url || isNaN(score))
          return { rating: 0, title: "", url: "" }

        const cleanTitle = title.split("\n")[0].trim()
        return { title: cleanTitle, url, rating: score }
      })

      return animes.filter((r) => r?.title && r?.url)
    })
    //.list-table-data

    return validAnimes
  }

  async _produceKafkaMessages(importItems: RatingsImportItem[]) {
    const producer = this.kafka.producer()
    await producer.connect()

    await producer.send
    await producer.sendBatch({
      topicMessages: [
        {
          topic: kafkaTopics.importRatingItem,
          messages: importItems.map((importItem) => ({
            value: JSON.stringify(importItem),
          })),
        },
      ],
    })

    await producer.disconnect()
  }

  async processRatingsImportItem(importRatingItem: RatingsImportItem) {
    try {
      const html = await this.myAxios
        .get<string>(importRatingItem.originalLink)
        .then((res) => res.data)

      const dom = new JSDOM(html)

      const malItemType =
        dom.window.document.querySelector(".information.type")?.textContent ||
        ""

      const googleResults = await this.googleSearchService.googleSearchAndCache(
        importRatingItem.originalTitle + " imdb"
      )

      const firstImdbResult = await this.googleSearchService.getFirstImdbResult(
        googleResults
      )

      let foundSyncroItem = await this.itemRepo.findSyncroItemById(
        firstImdbResult.imdbId
      )

      if (foundSyncroItem) {
        const alreadyRated = await this.ratingRepository.alreadyRated(
          importRatingItem.userId!,
          foundSyncroItem!.id
        )

        importRatingItem.status = alreadyRated
          ? "alreadyRated"
          : "importedSuccessfully"
      }

      if (!foundSyncroItem) {
        const isMovie = malItemType.includes("Movie")

        foundSyncroItem = await this.itemRepo.createSyncroItem({
          id: firstImdbResult.imdbId,
          avgRating: 0,
          ratingCount: 0,
          title: importRatingItem.originalTitle,
          type: isMovie ? "movie" : "tvSeries",
          imageUrl: firstImdbResult.imageUrl,
        })

        importRatingItem.status = "importedSuccessfully"
      }

      importRatingItem.syncroItemId = foundSyncroItem.id

      await this.importRepository.updateImportItem(importRatingItem)

      await this.ratingRepository.upsertRating({
        itemId: foundSyncroItem!.id,
        ratingValue: importRatingItem.ratingValue,
        userId: importRatingItem.userId!,
      })

      this._decrementRemainingItemsQty(importRatingItem.requestId)

      return
    } catch (e) {
      importRatingItem.status = "errorOrNotFound"
      await this.importRepository.updateImportItem(importRatingItem)
      await this._decrementRemainingItemsQty(importRatingItem.requestId)

      if (e instanceof Error)
        console.log("Error processing import item", e.message)
      throw e
    }
  }

  async _decrementRemainingItemsQty(requestId: string) {
    const importRequest = await this.importRepository.decrementRemainingItemsQty(
      requestId
    )

    if (importRequest.remainingItemsQty === 0) {
      this.importRepository.updateImportRequestStatus(
        requestId,
        "finishedSuccessfully"
      )
      this.notificationService.createFinishRatingImportNotification(requestId)
    }

    console.log("Remaining: " + importRequest.remainingItemsQty)
  }
}
