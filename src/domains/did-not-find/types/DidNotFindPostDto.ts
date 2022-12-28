import { IsString } from "class-validator"

export class DidNotFindPostDto {
  @IsString()
  query: string

  @IsString()
  type: string
}
