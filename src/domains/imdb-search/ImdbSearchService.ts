import { ImdbItemRepository } from "../imdb-item/ImdbItemRepository"
import { RatingRepository } from "../rating/RatingRepository"
import { ImdbSearchRepository } from "./ImdbSearchRepository"
import { Result } from "./types/MovieResultResponseDto"
import { SearchParams } from "./types/SearchParams"

export class ImdbSearchService {
  constructor(
    private imdbSearchRepository = new ImdbSearchRepository(),
    private imdbItemRepository = new ImdbItemRepository(),
    private ratingRepo = new RatingRepository()
  ) {}

  searchSeries = async (
    params: SearchParams,
    requesterId: string
  ): Promise<Result[]> => {
    const { results } = await this.imdbSearchRepository.searchImdbSeries(
      params.q
    )
    // if (params.type === "tv series") {
    //   return imdbResults.results.filter((r) => r.titleType === "tvSeries")
    // }

    // return imdbResults.results.filter((r) => r.titleType === "movie")

    const imdbIds = results.map((r) => r.id)
    const imdbItems = await this.imdbItemRepository.findImdbItemsByIds(imdbIds)
    const myRatings = await this.ratingRepo.findRatingsByUserIdAndItemsIds(
      requesterId,
      imdbIds
    )

    return results.map((result) => ({
      ...result,
      imdbItem: imdbItems.find((item) => item.id === result.id),
      myRating: myRatings.find((rating) => rating.imdbItemId === result.id),
    }))
  }
}
