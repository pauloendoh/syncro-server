import { IsString } from "class-validator"
import { SyncroItemType } from "./SyncroItemType/SyncroItemType"

export class SearchParams {
  @IsString()
  q: string

  @IsString()
  type: SyncroItemType | "users"
}
