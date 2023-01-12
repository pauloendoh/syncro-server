import { _SearchGoogleAndCache } from "../../search/searchUseCases/_SearchGoogleAndCache"
import { SyncroItemRepository } from "../../syncro-item/SyncroItemRepository"
import { IgdbCreateDto } from "../types/IgdbCreateDto"
import { _VerifyGameTitlesInIgdb } from "./_VerifyGameTitlesInIgdb"

type ExecParams = {
  query: string
  requesterId: string
}

// PE 1/3 - put inside GameService
export class _SearchAndCreateGames {
  constructor(
    private _searchGoogle = new _SearchGoogleAndCache(),
    private syncroItemRepo = new SyncroItemRepository(),
    private _verifyGameTitlesInIgdb = new _VerifyGameTitlesInIgdb()
  ) {}

  async exec({ query }: ExecParams) {
    const googleResults = await this._searchGoogle.exec({
      query: query + " igdb",
    })
    const igdbDtos: IgdbCreateDto[] = googleResults
      .filter((r) => r.link.includes("igdb.com/games"))
      .filter((r) => !r.link.includes("/reviews"))
      .filter((r) =>
        r.pagemap.metatags[0]["og:image"]?.includes("images.igdb.com/")
      )
      .map((r) => {
        const image = r.pagemap.metatags[0]["og:image"].startsWith("https://")
          ? r.pagemap.metatags[0]["og:image"]
          : "https:" + r.pagemap.metatags[0]["og:image"]

        return {
          igdbUrl: r.link,
          title: r.title,
          image,
        }
      })

    const verifiedIgdbDtos = await this._verifyGameTitlesInIgdb.exec(igdbDtos)

    const foundGamesInDb = await this.syncroItemRepo.findGamesByUrls(
      verifiedIgdbDtos.map((i) => i.igdbUrl)
    )

    const foundGamesUrls = foundGamesInDb.map((g) => g.igdbUrl)

    const notFoundGames = verifiedIgdbDtos.filter(
      (g) => !foundGamesUrls.includes(g.igdbUrl)
    )

    const createdGames = await this.syncroItemRepo.createGames(notFoundGames)

    return [...foundGamesInDb, ...createdGames]
  }
}
