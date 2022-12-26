import { SyncroItemType } from "@prisma/client"
import { _SearchAndCreateGames } from "../igdb-search/igdbSearchUseCases/_SearchAndCreateGames"
import { ImdbSearchClient } from "../imdb-search/ImdbSearchClient"
import { ImdbRapidApiItem } from "../imdb-search/types/ImdbResultResponseDto"
import { InterestRepository } from "../interest/InterestRepository"
import { MangaService } from "../manga/MangaService"
import { RatingRepository } from "../rating/RatingRepository"
import { SyncroItemRepository } from "../syncro-item/SyncroItemRepository"
import { UserRepository } from "../user/UserRepository"
import { SearchParams } from "./types/SearchParams"

export class SearchService {
  constructor(
    private imdbSearchClient = new ImdbSearchClient(),
    private imdbItemRepository = new SyncroItemRepository(),
    private ratingRepo = new RatingRepository(),
    private interestRepo = new InterestRepository(),
    private userRepo = new UserRepository(),
    private _searchGames = new _SearchAndCreateGames(),
    private mangaService = new MangaService()
  ) {}

  overallSearch = async (params: SearchParams, requesterId: string) => {
    if (params.type === "tvSeries" || params.type === "movie") {
      return this.searchImdbTitles(params.q, requesterId, params.type)
    }

    if (params.type === "manga") {
      return this.mangaService.searchAndCreateMangas(params.q)
    }

    if (params.type === "game")
      return this._searchGames.exec({
        query: params.q,
        requesterId,
      })

    return this.searchUsers(params.q)
  }

  searchImdbTitles = async (
    query: string,
    requesterId: string,
    itemType: SyncroItemType
  ): Promise<ImdbRapidApiItem[]> => {
    const { results } = await this.imdbSearchClient.searchImdbItems(
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

    return results.map(
      (result) =>
        ({
          ...result,
          syncroItem: imdbItems.find((item) => item.id === result.id),
          myRating: myRatings.find(
            (rating) => rating.syncroItemId === result.id
          ),
          myInterest: myInterests.find(
            (interest) => interest.syncroItemId === result.id
          ),
        } as ImdbRapidApiItem)
    )
  }

  searchUsers = async (query: string) => {
    return this.userRepo.searchUsersByUsername(query)
  }

  async googleSearch(params: SearchParams) {}
}
