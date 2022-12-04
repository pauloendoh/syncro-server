import { IsString } from "class-validator"

export class ImportRatingsPostDto {
  @IsString()
  username: string
}
