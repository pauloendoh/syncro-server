import { google } from "googleapis"
import { ImdbSearchRepository } from "../imdb-search/ImdbSearchRepository"
import { ImdbRapidApiItem } from "../imdb-search/types/ImdbResultResponseDto"
import { InterestRepository } from "../interest/InterestRepository"
import { RatingRepository } from "../rating/RatingRepository"
import { SyncroItemRepository } from "../syncro-item/SyncroItemRepository"
import { SyncroItemService } from "../syncro-item/SyncroItemService"
import { UserRepository } from "../user/UserRepository"
import { SearchParams } from "./types/SearchParams"
import { SyncroItemType } from "./types/SyncroItemType"

export class SearchService {
  constructor(
    private imdbSearchRepository = new ImdbSearchRepository(),
    private imdbItemRepository = new SyncroItemRepository(),
    private ratingRepo = new RatingRepository(),
    private interestRepo = new InterestRepository(),
    private userRepo = new UserRepository(),
    private imdbItemService = new SyncroItemService()
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
  ): Promise<ImdbRapidApiItem[]> => {
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
      myRating: myRatings.find((rating) => rating.syncroItemId === result.id),
      myInterest: myInterests.find(
        (interest) => interest.syncroItemId === result.id
      ),
    }))
  }

  searchUsers = async (query: string) => {
    return this.userRepo.searchUsersByUsername(query)
  }

  async googleSearch(params: SearchParams) {
    const customSearch = google.customsearch("v1")

    const query = this.getGoogleQuery(params)

    const response = await customSearch.cse.list({
      auth: process.env.GOOGLE_SEARCH_API_KEY,
      q: query,
      cx: "d4e78f2a07f64473d",
      num: 5,
    })

    // SDLKJFALÇSKJA --- parei aqui
    if (response.data.items?.[0]) return response.data.items[0]

    const links = response.data.items?.map((i) => i.link) || []

    const ids =
      response.data.items?.map(
        (i) => i.pagemap?.metatags?.[0]?.["imdb:pageconst"]
      ) || []
    const uniqueIds = ids.reduce<string[]>((resultIds, currentId) => {
      if (currentId && !resultIds.includes(currentId))
        return [...resultIds, currentId]
      return resultIds
    }, [])

    if (uniqueIds.length === 0) return null

    const result = this.imdbItemService.findAndSaveDetails(
      `/title/${uniqueIds[0]}/`
    )
    return result
  }

  getGoogleQuery(params: SearchParams) {
    if (params.type === "tv series") return `${params.q} game metacritic`
    if (params.type === "movie") return `${params.q} imdb movie`

    return params.q
  }
}
