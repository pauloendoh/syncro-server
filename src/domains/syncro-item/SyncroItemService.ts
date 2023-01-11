import { ForbiddenError } from "routing-controllers"
import { NotFoundError404 } from "../../utils/errors/NotFoundError404"
import { ImdbSearchClient } from "../imdb-search/ImdbSearchClient/ImdbSearchClient"
import { MangaService } from "../manga/MangaService"
import { SyncroItemRepository } from "./SyncroItemRepository"
import { UseFindAndSaveGameDetails } from "./syncroItemUseCases/UseFindAndSaveGameDetails"
import { UseFindAndSaveImdbDetails } from "./syncroItemUseCases/UseFindAndSaveImdbDetails"
export class SyncroItemService {
  constructor(
    private imdbSearchRepository = new ImdbSearchClient(),
    private itemRepo = new SyncroItemRepository(),
    private _UseFindAndSaveImdbDetails = new UseFindAndSaveImdbDetails(),
    private useFindGameDetails = new UseFindAndSaveGameDetails(),
    private mangaService = new MangaService(),
    private imdbClient = new ImdbSearchClient()
  ) {}

  async findAndSaveDetails(itemId: string) {
    const found = await this.itemRepo.findSyncroItemById(itemId)
    if (found && found.type === "game") {
      return this.useFindGameDetails.exec({ syncroItem: found })
    }

    if (found && found.type === "manga") {
      return this.mangaService.findAndSaveMangaDetails(found)
    }

    return this._UseFindAndSaveImdbDetails.exec({
      itemId,
      syncroItem: found,
    })
  }

  async updateItemRating(itemId: string) {
    const foundItem = await this.itemRepo.findSyncroItemById(itemId)
    if (!foundItem) throw new NotFoundError404("Item not found")

    // was updated this week?
    const wasUpdatedThisWeek =
      foundItem.updatedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    if (wasUpdatedThisWeek) {
      throw new ForbiddenError("Item was already updated this week")
    }

    if (foundItem.type === "tvSeries" || foundItem.type === "movie") {
      const splits = itemId.trim().split("/")
      const tconst = splits[splits.length - 2]
      const imdbResponse = await this.imdbClient.fetchAndCacheImdbItemDetails(
        tconst,
        undefined,
        true
      )

      foundItem.avgRating = imdbResponse.ratings.rating
      foundItem.ratingCount = imdbResponse.ratings.ratingCount
      return this.itemRepo.updateSyncroItem(foundItem)
    }

    return foundItem
  }

  async getUserItemsCount(userId: string) {
    return this.itemRepo.findUserItemsCount(userId)
  }
}
