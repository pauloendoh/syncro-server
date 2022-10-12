import { InternalServerError } from "routing-controllers"
import myImdbAxios from "../../utils/myImdbAxios"
import myRedis from "../../utils/redis/myRedisClient"
import { redisKeys } from "../../utils/redis/redisKeys"
import { urls } from "../../utils/urls"
import { ImdbItemDetailsResponse } from "../imdb-item/types/ImdbItemDetailsGetDto"
import { MovieResultResponseDto } from "../search/types/MovieResultResponseDto"

export class ImdbSearchRepository {
  constructor(private imdbAxios = myImdbAxios) {}

  async searchImdbSeries(query: string): Promise<MovieResultResponseDto> {
    const cached = await myRedis.get(redisKeys.imdbQueryResult(query))
    if (cached) return JSON.parse(cached)

    const result = await this.imdbAxios
      .get<MovieResultResponseDto>(urls.movieResults, {
        params: {
          title: query,
          titleType: "tvSeries", // PE 1/3 - for now, only tvSeries
        },
      })
      .then((res) => res.data)

    const ONE_WEEK_IN_SECONDS = 3600 * 24 * 7

    myRedis.set(
      redisKeys.imdbQueryResult(query),
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
