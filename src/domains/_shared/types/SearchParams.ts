import { IsEnum, IsString } from "class-validator"

const types = ["tvSeries", "movie", "game", "manga", "users"] as const
type SearchType = typeof types[number]

export class SearchParams {
  @IsString()
  q: string

  @IsEnum(types)
  type: "tvSeries" | "movie" | "game" | "manga" | "users"
}
