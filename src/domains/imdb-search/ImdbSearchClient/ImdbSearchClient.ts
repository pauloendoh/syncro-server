import { SyncroItemType } from "@prisma/client"
import axios from "axios"
import { InternalServerError } from "routing-controllers"
import myRedisClient from "../../../utils/redis/myRedisClient"
import { redisKeys } from "../../../utils/redis/redisKeys"
import { urls } from "../../../utils/urls"
import igdbAxios from "../../igdb-search/utils/igdbAxios"
import { ImdbItemDetailsResponse } from "../../syncro-item/types/ImdbItemDetailsGetDto"
import { ImdbResultResponseDto } from "../types/ImdbResultResponseDto"

const { RAPIDAPI_KEY, RAPIDAPI_KEY_2 } = process.env
export class ImdbSearchClient {
  constructor(private axios = igdbAxios, private redisClient = myRedisClient) {}

  async searchCacheImdbItems(param: {
    query: string
    itemType: SyncroItemType
    apiNumber?: number
  }): Promise<ImdbResultResponseDto> {
    const { query, itemType, apiNumber = 1 } = param

    try {
      const cached = await myRedisClient.get(
        redisKeys.imdbQueryResult(query, itemType)
      )
      if (cached) return JSON.parse(cached)

      const result = await this.axios
        .get<ImdbResultResponseDto>(urls.imdbTitles(apiNumber), {
          params: {
            title: query,
            titleType:
              itemType === "tvSeries"
                ? "tvSeries,short,tvMiniSeries,tvSpecial,tvShort"
                : "movie,tvMovie", // PE 1/3 - for now, only tvSeries
          },
          headers: {
            "x-rapidapi-key":
              apiNumber === 1
                ? String(process.env.RAPIDAPI_KEY)
                : String(process.env.RAPIDAPI_KEY_2),
            "x-rapidapi-host":
              apiNumber === 1
                ? "imdb8.p.rapidapi.com"
                : "online-movie-database.p.rapidapi.com",
          },
        })
        .then((res) => res.data)

      const ONE_WEEK_IN_SECONDS = 3600 * 24 * 7

      myRedisClient.set(
        redisKeys.imdbQueryResult(query, itemType),
        JSON.stringify(result),
        "EX",
        ONE_WEEK_IN_SECONDS
      )

      return result
    } catch (e) {
      if (
        axios.isAxiosError(e) &&
        e.response &&
        e.response.status === 429 &&
        apiNumber === 1
      )
        return this.searchCacheImdbItems({ query, itemType, apiNumber: 2 })

      throw e
    }
  }

  // PE 1/3 - params
  async fetchAndCacheImdbItemDetails(
    imdbId: string,
    apiNumber = 1,
    overwriteCache = false
  ): Promise<ImdbItemDetailsResponse> {
    try {
      const cached = await this.redisClient.get(
        redisKeys.imdbItemDetails(imdbId)
      )
      if (cached && !overwriteCache) return JSON.parse(cached)

      const result = await this.axios
        .get<ImdbItemDetailsResponse>(urls.imdbTitleDetails(apiNumber), {
          params: {
            tconst: imdbId,
            currentCountry: "US",
          },
          headers: {
            "x-rapidapi-key":
              apiNumber === 1
                ? String(process.env.RAPIDAPI_KEY)
                : String(process.env.RAPIDAPI_KEY_2),
            "x-rapidapi-host":
              apiNumber === 1
                ? "imdb8.p.rapidapi.com"
                : "online-movie-database.p.rapidapi.com",
          },
        })
        .then((res) => res.data)
        .catch((e) => {
          if (axios.isAxiosError(e) && e.response?.status === 429) throw e
          throw new InternalServerError(
            e?.response?.data?.message || e?.message
          )
        })

      this.redisClient.set(
        redisKeys.imdbItemDetails(imdbId),
        JSON.stringify(result),
        "EX",
        3600 * 24 * 7
      )

      return result
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response?.status === 429 &&
        apiNumber === 1
      )
        return this.fetchAndCacheImdbItemDetails(imdbId, 2)

      throw err
    }
  }
}
