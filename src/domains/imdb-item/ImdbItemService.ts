import { ImdbSearchRepository } from "../imdb-search/ImdbSearchRepository"
import { ImdbItemRepository } from "./ImdbItemRepository"

export class ImdbItemService {
  constructor(
    private imdbSearchRepository = new ImdbSearchRepository(),
    private imdbItemRepository = new ImdbItemRepository()
  ) {}
  async findAndSaveDetails(imdbId: string) {
    const found = await this.imdbItemRepository.findImdbItemById(imdbId)
    if (found) return found

    const splits = imdbId.trim().split("/")
    const tconst = splits[splits.length - 2] // tconst is only the imdb id in /title/:id

    const result = await this.imdbSearchRepository.fetchImdbItemDetails(tconst)

    if (result.title.titleType === "tvMiniSeries")
      result.title.titleType = "tvSeries"

    return this.imdbItemRepository.createFromImdbSearch(imdbId, result)
  }

  async findImdbItemsRatedByUserId(userId: string) {
    return this.imdbItemRepository.findImdbItemsRatedByUserId(userId)
  }
}
