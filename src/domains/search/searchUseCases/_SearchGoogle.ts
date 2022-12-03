import { google } from "googleapis"
import myRedisClient from "../../../utils/redis/myRedisClient"
import { redisKeys } from "../../../utils/redis/redisKeys"
import { GoogleItemDto } from "../types/GoogleItemDto"

type ExecParams = {
  query: string
}

// CACHE THIS
export class _SearchGoogle {
  async exec(query: string): Promise<GoogleItemDto[]> {
    const cached = await myRedisClient.get(redisKeys.googleSearch(query))
    if (cached) return JSON.parse(cached)

    const customSearch = google.customsearch("v1")

    const response = await customSearch.cse.list({
      auth: process.env.GOOGLE_SEARCH_API_KEY,
      q: query,
      cx: "d4e78f2a07f64473d",
      num: 10,
    })

    const googleResultItems = response.data.items as GoogleItemDto[]

    myRedisClient.set(
      redisKeys.googleSearch(query),
      JSON.stringify(googleResultItems),
      "EX",
      60 * 60 * 24 * 7
    )

    return googleResultItems

    //   const links = response.data.items?.map((i) => i.link) || []

    //   const ids =
    //     response.data.items?.map(
    //       (i) => i.pagemap?.metatags?.[0]?.["imdb:pageconst"]
    //     ) || []
    //   const uniqueIds = ids.reduce<string[]>((resultIds, currentId) => {
    //     if (currentId && !resultIds.includes(currentId))
    //       return [...resultIds, currentId]
    //     return resultIds
    //   }, [])

    //   if (uniqueIds.length === 0) return null

    //   const result = this.imdbItemService.findAndSaveDetails(
    //     `/title/${uniqueIds[0]}/`
    //   )
    //   return result
    // }
  }
}