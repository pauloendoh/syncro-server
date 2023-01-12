import { SyncroItem } from "@prisma/client"
import { BadRequestError } from "routing-controllers"
import { NotFoundError404 } from "../../utils/errors/NotFoundError404"
import { _SearchGoogleAndCache } from "../search/searchUseCases/_SearchGoogleAndCache"
import { SyncroItemRepository } from "../syncro-item/SyncroItemRepository"

export class YoutubeService {
  constructor(
    private itemRepo = new SyncroItemRepository(),
    private searchGoogle = new _SearchGoogleAndCache()
  ) {}

  async searchYoutubeVideos(itemId: string) {
    const itemFound = await this.itemRepo.findSyncroItemById(itemId)
    if (!itemFound) throw new NotFoundError404("Item not found")

    if (itemFound.type === "manga") {
      throw new BadRequestError("Manga items are not supported")
    }

    const query = this.getQuery(itemFound)

    const googleResults = await this.searchGoogle.exec({ query, 
    siteSearch: 'www.youtube.com'
    })

    const youtubeResults = googleResults.filter((result) => {
      return result.link.includes("https://www.youtube.com/watch?v=")
    })

    if (itemFound.type === "game") {
      return youtubeResults
        .sort((a, b) => (a.title.toLowerCase().includes("gameplay") ? -1 : 1))
        .sort((a,b) => (a.title.toLowerCase().includes(itemFound.title.toLowerCase()) ? -1: 1))
        .slice(0, 4)
        .map((y) => y.link)
    }

    return youtubeResults.slice(0, 4).map((y) => y.link)
  }

  private getQuery(item: SyncroItem) {
    if (item.type === "manga") return ""
    if (item.type === "movie" || item.type === "tvSeries") {
      return `${item.title} ${item.year} trailer`
    }

    return `${item.title} ${item.year} gameplay`
  }
}
