import { _SearchGoogle } from "../../search/searchUseCases/_SearchGoogle"
import { SyncroItemRepository } from "../../syncro-item/SyncroItemRepository"
import { IgdbCreateDto } from "../types/IgdbCreateDto"
import { _ValidateIgdbCreateDtos } from "./_ValidateIgdbCreateDtos"

type ExecParams = {
  query: string
  requesterId: string
}

export class _SearchAndCreateGames {
  constructor(
    private _searchGoogle = new _SearchGoogle(),
    private syncroItemRepo = new SyncroItemRepository(),
    private useValidateIgdbCreateDtos = new _ValidateIgdbCreateDtos()
  ) {}

  async exec({ query }: ExecParams) {
    const googleResults = await this._searchGoogle.exec(query + " igdb")
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

    const validIgdbDtos = await this.useValidateIgdbCreateDtos.exec(igdbDtos)

    const foundGames = await this.syncroItemRepo.findGamesByUrls(
      validIgdbDtos.map((i) => i.igdbUrl)
    )

    const foundGamesUrls = foundGames.map((g) => g.igdbUrl)

    const notFoundGames = validIgdbDtos.filter(
      (g) => !foundGamesUrls.includes(g.igdbUrl)
    )

    const createdGames = await this.syncroItemRepo.createGames(notFoundGames)

    return [...foundGames, ...createdGames]
  }
}
