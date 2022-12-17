import { SyncroItemType } from "@prisma/client"
import { IsString } from "class-validator"

export class SearchParams {
  @IsString()
  q: string

  @IsString()
  type: SyncroItemType | "users"
}
