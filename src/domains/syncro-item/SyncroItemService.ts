import { ImdbSearchClient } from "../imdb-search/ImdbSearchClient"
import { SyncroItemRepository } from "./SyncroItemRepository"
import { UseFindAndSaveGameDetails } from "./syncroItemUseCases/UseFindAndSaveGameDetails"
import { UseFindAndSaveImdbDetails } from "./syncroItemUseCases/UseFindAndSaveImdbDetails"
export class SyncroItemService {
  constructor(
    private imdbSearchRepository = new ImdbSearchClient(),
    private itemRepo = new SyncroItemRepository(),

    private _UseFindAndSaveImdbDetails = new UseFindAndSaveImdbDetails(),
    private useFindGameDetails = new UseFindAndSaveGameDetails()
  ) {}
  async findAndSaveDetails(itemId: string) {
    const found = await this.itemRepo.findSyncroItemById(itemId)
    if (found && found.type === "game") {
      return this.useFindGameDetails.exec({ syncroItem: found })
    }

    return this._UseFindAndSaveImdbDetails.exec({
      itemId,
      syncroItem: found,
    })
  }
}
