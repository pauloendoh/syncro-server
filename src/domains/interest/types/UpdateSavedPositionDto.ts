import { IsNumber, IsString } from "class-validator"

export class UpdateSavedPositionDto {
  @IsString()
  interestId: string

  @IsNumber()
  newPosition: number
}
