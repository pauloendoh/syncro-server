import myRedisClient from "../../utils/redis/myRedisClient"
import { redisKeys } from "../../utils/redis/redisKeys"
import { urls } from "../../utils/urls"
import { IgdbSearchDto } from "./types/IgdbSearchDto"
import igdbAxios from "./utils/igdbAxios"

export class IgdbClient {
  constructor(private axios = igdbAxios, private redisClient = myRedisClient) {}

  async searchGame(title: string) {
    return this.axios.post<IgdbSearchDto[]>(
      urls.igdbGames,
      `
      search "${title}"; fields id, rating, rating_count, url, name, first_release_date, summary; 
      where rating_count > 0;
    `
    )
  }

  async searchGameTitles(titles: string[]) {
    if (titles.length === 0) return []

    const whereQuery = titles
      .map((t) => `name = "${t}" & rating_count > 0`)
      .join(" | ")

    return this.axios
      .post<IgdbSearchDto[]>(
        urls.igdbGames,
        `fields id, rating, rating_count, url, name, first_release_date, summary;
where ${whereQuery};
    `
      )
      .then((res) => res.data)
  }

  async searchAndCacheGameImagesByIds(ids: number[]) {
    const cached = await this.redisClient.get(redisKeys.igdbGameImages(ids))

    if (cached) return JSON.parse(cached) as IgdbImageDto[]

    const res = await this.axios.post<IgdbImageDto[]>(
      urls.igdbCovers,
      `
      where ${ids.map((id) => `game = ${id}`).join(" | ")};  
      fields *;
    `
    )

    await this.redisClient.set(
      redisKeys.igdbGameImages(ids),
      JSON.stringify(res.data),
      "EX",
      60 * 60 * 24 * 7 // 1 week
    )

    return res.data
  }
}
