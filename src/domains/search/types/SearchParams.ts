import { IsString } from "class-validator"

export class SearchParams {
  @IsString()
  q: string

  @IsString()
  type: "movie" | "tv series"
}
