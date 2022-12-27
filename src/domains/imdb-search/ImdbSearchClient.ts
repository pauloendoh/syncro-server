import { SyncroItemType } from "@prisma/client"
import { AxiosError } from "axios"
import { InternalServerError } from "routing-controllers"
import myImdbAxios from "../../utils/myImdbAxios"
import myRedisClient from "../../utils/redis/myRedisClient"
import { redisKeys } from "../../utils/redis/redisKeys"
import { urls } from "../../utils/urls"
import { ImdbItemDetailsResponse } from "../syncro-item/types/ImdbItemDetailsGetDto"
import { ImdbResultResponseDto } from "./types/ImdbResultResponseDto"

const { RAPIDAPI_KEY, RAPIDAPI_KEY_2 } = process.env
export class ImdbSearchClient {
  constructor(
    private imdbAxios = myImdbAxios,
    private redisClient = myRedisClient
  ) {}

  async searchCacheImdbItems(
    query: string,
    itemType: SyncroItemType,
    apiNumber = 1
  ): Promise<ImdbResultResponseDto> {
    try {
      const cached = await myRedisClient.get(
        redisKeys.imdbQueryResult(query, itemType)
      )
      if (cached) return JSON.parse(cached)

      const result = await this.imdbAxios
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
        e instanceof AxiosError &&
        e.response?.status === 429 &&
        apiNumber === 1
      )
        return this.searchCacheImdbItems(query, itemType, 2)

      throw e
    }
  }

  async fetchAndCacheImdbItemDetails(
    imdbId: string,
    apiNumber = 1
  ): Promise<ImdbItemDetailsResponse> {
    try {
      const cached = await this.redisClient.get(
        redisKeys.imdbItemDetails(imdbId)
      )
      if (cached) return JSON.parse(cached)

      const result = await this.imdbAxios
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
          if (e instanceof AxiosError && e.response?.status === 429) throw e
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
        err instanceof AxiosError &&
        err.response?.status === 429 &&
        apiNumber === 1
      )
        return this.fetchAndCacheImdbItemDetails(imdbId, 2)

      throw err
    }
  }
}
