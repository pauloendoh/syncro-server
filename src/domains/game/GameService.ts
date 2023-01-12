import { IgdbClient } from "../igdb-search/IgdbClient"
import { IgdbCreateDto } from "../igdb-search/types/IgdbCreateDto"
import { SyncroItemRepository } from "../syncro-item/SyncroItemRepository"

export class GameService {
  constructor(
    private igdbClient = new IgdbClient(),
    private syncroItemRepo = new SyncroItemRepository()
  ) {}

  // start search via igdb, instead of google
  async searchAndCreateMoreGames(query: string) {
    const igdbResults = await this.igdbClient.searchGame(query)

    const images = await this.igdbClient.searchAndCacheGameImagesByIds(
      igdbResults.data.map((r) => r.id)
    )

    const createDtos = igdbResults.data.map(
      (r) =>
        ({
          igdbUrl: r.url,
          title: r.name,
          image: images.find((i) => i.game === r.id)?.url
            ? `https:${images.find((i) => i.game === r.id)?.url}`
            : "",
        } as IgdbCreateDto)
    )

    const foundGamesInDb = await this.syncroItemRepo.findGamesByUrls(
      createDtos.map((i) => i.igdbUrl)
    )

    const foundGamesUrls = foundGamesInDb.map((g) => g.igdbUrl)

    const notFoundGames = createDtos.filter(
      (g) => !foundGamesUrls.includes(g.igdbUrl)
    )

    const createdGames = await this.syncroItemRepo.createGames(notFoundGames)

    return [...foundGamesInDb, ...createdGames]
  }
}
