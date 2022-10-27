import { ImdbItemRepository } from "../imdb-item/ImdbItemRepository"
import { ImdbSearchRepository } from "../imdb-search/ImdbSearchRepository"
import { Result } from "../imdb-search/types/ImdbResultResponseDto"
import { InterestRepository } from "../interest/InterestRepository"
import { RatingRepository } from "../rating/RatingRepository"
import { UserRepository } from "../user/UserRepository"
import { SearchParams } from "./types/SearchParams"
import { SyncroItemType } from "./types/SyncroItemType"

export class SearchService {
  constructor(
    private imdbSearchRepository = new ImdbSearchRepository(),
    private imdbItemRepository = new ImdbItemRepository(),
    private ratingRepo = new RatingRepository(),
    private interestRepo = new InterestRepository(),
    private userRepo = new UserRepository()
  ) {}

  overallSearch = async (params: SearchParams, requesterId: string) => {
    if (params.type === "tv series" || params.type === "movie") {
      return this.searchImdbTitles(params.q, requesterId, params.type)
    }

    return this.searchUsers(params.q)
  }

  searchImdbTitles = async (
    query: string,
    requesterId: string,
    itemType: SyncroItemType
  ): Promise<Result[]> => {
    const { results } = await this.imdbSearchRepository.searchImdbItems(
      query,
      itemType
    )

    if (!results) return []

    const imdbIds = results.map((r) => r.id) || []
    const imdbItems = await this.imdbItemRepository.findImdbItemsByIds(imdbIds)
    const myRatings = await this.ratingRepo.findRatingsByUserIdAndItemsIds(
      requesterId,
      imdbIds
    )
    const myInterests = await this.interestRepo.findInterestsByUserIdAndItemsIds(
      requesterId,
      imdbIds
    )

    return results.map((result) => ({
      ...result,
      imdbItem: imdbItems.find((item) => item.id === result.id),
      myRating: myRatings.find((rating) => rating.imdbItemId === result.id),
      myInterest: myInterests.find(
        (interest) => interest.imdbItemId === result.id
      ),
    }))
  }

  searchUsers = async (query: string) => {
    return this.userRepo.searchUsersByUsername(query)
  }
}
