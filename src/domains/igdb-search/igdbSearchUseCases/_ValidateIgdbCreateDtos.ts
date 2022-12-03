import myRedisClient from "../../../utils/redis/myRedisClient"
import { redisKeys } from "../../../utils/redis/redisKeys"
import { IgdbClient } from "../IgdbClient"
import { IgdbCreateDto } from "../types/IgdbCreateDto"
import { IgdbSearchDto } from "../types/IgdbSearchDto"

type ExecParams = {
  requesterId: string
}

export class _ValidateIgdbCreateDtos {
  constructor(
    private redisClient = myRedisClient,
    private igdbClient = new IgdbClient()
  ) {}

  async exec(igdbDtos: IgdbCreateDto[]) {
    const gameTitles = igdbDtos.map((dto) => dto.title)

    const cachedGameTitles = await this.redisClient.get(
      redisKeys.igdbGameTitles(gameTitles)
    )

    const foundGameTitles: IgdbSearchDto[] = cachedGameTitles
      ? JSON.parse(cachedGameTitles)
      : await this.igdbClient.searchGameTitles(gameTitles)

    if (!cachedGameTitles)
      await this.redisClient.set(
        redisKeys.igdbGameTitles(gameTitles),
        JSON.stringify(foundGameTitles),
        "EX",
        60 * 60 * 24 * 7
      )

    return igdbDtos.filter((igdbDto) =>
      foundGameTitles.find(
        (foundGameTitle) => foundGameTitle.name === igdbDto.title
      )
    )
  }
}
