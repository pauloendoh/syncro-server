import { NotFoundError404 } from "../../utils/errors/NotFoundError404"
import { _SearchGoogleAndCache } from "../search/searchUseCases/_SearchGoogleAndCache"
import { GoogleItemDto } from "../search/types/GoogleItemDto"

export class GoogleSearchService {
  constructor(private useGoogleSearchAndCache = new _SearchGoogleAndCache()) {}

  async googleSearchAndCache(query: string) {
    return this.useGoogleSearchAndCache.exec({ query })
  }

  async getFirstImdbResult(googleResults: GoogleItemDto[]) {
    // PE 1/3 DRY ?
    const filtered = googleResults.filter((r) => {
      if (!r.link.includes("https://www.imdb.com/title/")) return false
      const formatted = r.link.split("https://www.imdb.com")[1]
      const slashCount = formatted.split("/").length - 1

      if (slashCount !== 3) return false // should pass -> "https://www.imdb.com/title/tt8019444/" -> /title/tt8019444/

      const containsQuery = formatted.includes("?")
      if (containsQuery) return false
      return true
    })

    const firstResult = filtered[0]

    if (!firstResult) {
      throw new NotFoundError404()
    }

    const imdbId = firstResult.link.split("https://www.imdb.com")[1]
    const imageUrl = firstResult.pagemap.cse_thumbnail[0].src
    return {
      imdbId,
      imageUrl,
    }
  }
}
