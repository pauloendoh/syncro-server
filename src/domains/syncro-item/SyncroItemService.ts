import { ImdbSearchRepository } from "../imdb-search/ImdbSearchRepository"
import { SyncroItemRepository } from "./SyncroItemRepository"

export class SyncroItemService {
  constructor(
    private imdbSearchRepository = new ImdbSearchRepository(),
    private itemRepo = new SyncroItemRepository()
  ) {}
  async findAndSaveDetails(imdbId: string) {
    const found = await this.itemRepo.findSyncroItemById(imdbId)
    if (found) return found

    const splits = imdbId.trim().split("/")
    const tconst = splits[splits.length - 2] // tconst is only the imdb id in /title/:id

    const result = await this.imdbSearchRepository.fetchImdbItemDetails(tconst)

    if (result.title.titleType === "tvMiniSeries")
      result.title.titleType = "tvSeries"

    return this.itemRepo.createFromImdbSearch(imdbId, result)
  }

  async findImdbItemsRatedByUserId(userId: string) {
    return this.itemRepo.findImdbItemsRatedByUserId(userId)
  }
}
