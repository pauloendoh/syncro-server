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
    private mangaService = new MangaService()
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
}
