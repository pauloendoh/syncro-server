import { SyncroItem } from "@prisma/client"
import Axios from "axios"
import { upToNDecimals } from "endoh-utils"
import { JSDOM } from "jsdom"
import { BadRequestError } from "routing-controllers"
import { _SearchGoogleAndCache } from "../search/searchUseCases/_SearchGoogleAndCache"
import { GoogleItemDto } from "../search/types/GoogleItemDto"
import { SyncroItemRepository } from "../syncro-item/SyncroItemRepository"
import { MangaRepository } from "./MangaRepository"
import { MangaCreateDto } from "./types/MangaCreateDto"

export class MangaService {
  constructor(
    private _searchGoogle = new _SearchGoogleAndCache(),
    private mangaRepo = new MangaRepository(),
    private axios = Axios.create(),
    private itemRepo = new SyncroItemRepository()
  ) {}

  async searchAndCreateMangas(query: string) {
    const googleResults = await this._searchGoogle.exec({
      query: query + " manga mal",
    })

    const filteredMangaDto = this._filterAndCreateMangaDto(googleResults)

    const foundMangasInDb = await this.mangaRepo.findMangasByUrls(
      filteredMangaDto.map((d) => d.mangaMalUrl)
    )
    const foundMangaUrls = foundMangasInDb.map((m) => m.mangaMalUrl)

    const notFoundMangas = filteredMangaDto.filter(
      (d) => !foundMangaUrls.includes(d.mangaMalUrl)
    )

    const createdMangas = await this.mangaRepo.createMangas(notFoundMangas)

    return [...foundMangasInDb, ...createdMangas]
  }

  _filterAndCreateMangaDto(googleResults: GoogleItemDto[]): MangaCreateDto[] {
    return googleResults
      .filter((r) => r.link.includes("https://myanimelist.net/manga/"))
      .filter((r) => {
        const afterSlash = r.link.split("https://myanimelist.net/manga/").pop()
        if (!afterSlash) return false
        if (r.link.includes("?")) return false // query parameters. Eg:https://myanimelist.net/manga/4632/Oyasumi_Punpun?xid=17259%2C1500002%2C15700002%2C15700021%2C15700186%2C15700190%2C15700248%2C15700253
        const slashesCount = afterSlash.split("/").length - 1
        return slashesCount === 1

        // Eg: https://myanimelist.net/manga/436/Uzumaki <- only one "/" in '436/Uzumaki'
      })
      .map((r) => ({
        mangaMalUrl: r.link,
        image: r.pagemap["cse_thumbnail"]?.[0]["src"] ||
        r.pagemap.product?.[0]["image"] || 
        "",
        title: r.pagemap["product"]?.[0].name || r.title,
        avgRating: upToNDecimals(
          Number(r.pagemap["aggregaterating"]?.[0]?.ratingvalue || 0),
          1
        ),
        ratingCount: Number(
          r.pagemap["aggregaterating"]?.[0]?.ratingcount || 0
        ),
        summary: r.pagemap.metatags[0]["og:description"],
      }))
  }

  async findAndSaveMangaDetails(item: SyncroItem) {
    if (!item.mangaMalUrl) throw new BadRequestError("MangaMalUrl is required")

    if (item.year) return item

    const html = await this.axios.get(item.mangaMalUrl)
    const dom = new JSDOM(html.data)

    const originalTitle =
      dom.window.document
        .querySelector("[itemprop='name']")
        ?.innerHTML?.split("<br")[0] || ""

    const titleEnglish =
      dom.window.document.querySelector(".title-english")?.textContent || ""

    const fullTitle = originalTitle + (titleEnglish ? ` (${titleEnglish})` : "")

    const year = this._extractPublishedYearFromHtml(html.data)

    return this.itemRepo.updateSyncroItem({
      ...item,
      title: fullTitle,
      year,
    })
  }

  _extractPublishedYearFromHtml(html: string) {
    const secondPart = html.split("Published:</span> ")[1]
    const yearDiv = secondPart.split(",")[1] //Jun  17, 2016</div>
    const year = Number(yearDiv.split("<")[0]) // 2016</div>

    if (isNaN(year)) return null
    return year
  }

  async findMangaPanels(itemId: string) {
    const item = await this.itemRepo.findSyncroItemById(itemId)
    if (!item) throw new BadRequestError("Item not found")

    const originalTitle = item.title.split("(")[0].trim()
    const query = `${originalTitle} manga panels`

    const googleResults = await this._searchGoogle.exec({
      query,
      excludeTerm: undefined,
      isImage: true,
    })

    const images = googleResults.filter((r) => r?.fileFormat !== "image/")

    return images.map((r) => r.link)
  }
}
