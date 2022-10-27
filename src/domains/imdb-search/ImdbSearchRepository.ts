import { InternalServerError } from "routing-controllers"
import myImdbAxios from "../../utils/myImdbAxios"
import myRedis from "../../utils/redis/myRedisClient"
import { redisKeys } from "../../utils/redis/redisKeys"
import { urls } from "../../utils/urls"
import { ImdbItemDetailsResponse } from "../imdb-item/types/ImdbItemDetailsGetDto"
import { SyncroItemType } from "../search/types/SyncroItemType"
import { ImdbResultResponseDto } from "./types/ImdbResultResponseDto"

export class ImdbSearchRepository {
  constructor(private imdbAxios = myImdbAxios) {}

  async searchImdbItems(
    query: string,
    itemType: SyncroItemType
  ): Promise<ImdbResultResponseDto> {
    const cached = await myRedis.get(redisKeys.imdbQueryResult(query, itemType))
    if (cached) return JSON.parse(cached)

    const result = await this.imdbAxios
      .get<ImdbResultResponseDto>(urls.imdbTitles, {
        params: {
          title: query,
          titleType: itemType === "tv series" ? "tvSeries" : "movie", // PE 1/3 - for now, only tvSeries
        },
      })
      .then((res) => res.data)

    const ONE_WEEK_IN_SECONDS = 3600 * 24 * 7

    myRedis.set(
      redisKeys.imdbQueryResult(query, itemType),
      JSON.stringify(result),
      "EX",
      ONE_WEEK_IN_SECONDS
    )

    return result
  }

  async fetchImdbItemDetails(imdbId: string): Promise<ImdbItemDetailsResponse> {
    const result = await this.imdbAxios
      .get<ImdbItemDetailsResponse>(urls.imdbTitleDetails, {
        params: {
          tconst: imdbId,
          currentCountry: "US",
        },
      })
      .then((res) => res.data)
      .catch((e) => {
        throw new InternalServerError(e?.response?.data?.message || e?.message)
      })

    return result
  }
}
