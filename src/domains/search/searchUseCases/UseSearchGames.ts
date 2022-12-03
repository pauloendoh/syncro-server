import { SyncroItemRepository } from "../../syncro-item/SyncroItemRepository"
import { IgdbCreateDto } from "../types/IgdbCreateDto"
import { UseGoogleSearch } from "./UseGoogleSearch"
import { UseValidateIgdbCreateDtos } from "./UseValidateIgdbCreateDtos"

type ExecParams = {
  query: string
  requesterId: string
}

export class UseSearchGames {
  constructor(
    private _googleSearch = new UseGoogleSearch(),
    private syncroItemRepo = new SyncroItemRepository(),
    private useValidateIgdbCreateDtos = new UseValidateIgdbCreateDtos()
  ) {}

  async exec({ query, requesterId }: ExecParams) {
    const googleResults = await this._googleSearch.exec(query + " igdb")
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
