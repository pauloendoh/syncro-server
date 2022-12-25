import { SyncroItem } from "@prisma/client"
import { ImdbSearchClient } from "../../imdb-search/ImdbSearchClient"
import { SyncroItemRepository } from "../SyncroItemRepository"

type ExecParams = { syncroItem: SyncroItem | null; itemId: string }

export class UseFindAndSaveImdbDetails {
  constructor(
    private imdbClient = new ImdbSearchClient(),
    private itemRepo = new SyncroItemRepository()
  ) {}

  exec = async ({ syncroItem, itemId }: ExecParams) => {
    if (syncroItem?.year) return syncroItem

    const splits = itemId.trim().split("/")
    const tconst = splits[splits.length - 2] // tconst is only the imdb id in /title/:id/

    const result = await this.imdbClient.fetchAndCacheImdbItemDetails(tconst)

    // PE 1/3 - anything that is not a movie, is a tvSeries ? ...
    if (result.title.titleType === "tvMiniSeries")
      result.title.titleType = "tvSeries"

    if (result.title.titleType === "tvEpisode")
      result.title.titleType = "tvSeries"

    return this.itemRepo.createFromImdbSearch(itemId, result)
  }
}
