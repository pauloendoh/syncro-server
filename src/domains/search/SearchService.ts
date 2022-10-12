import { ImdbSearchRepository } from "../imdb-search/ImdbSearchRepository"
import { SearchParams } from "./types/SearchParams"

export class SearchService {
  constructor(private imdbSearchRepository = new ImdbSearchRepository()) {}

  async search(params: SearchParams) {
    const imdbResults = await this.imdbSearchRepository.searchImdbSeries(
      params.q
    )
    if (params.type === "tv series") {
      return imdbResults.results.filter((r) => r.titleType === "tvSeries")
    }

    return imdbResults.results.filter((r) => r.titleType === "movie")
  }
}
