import { User } from "@prisma/client"
import {
  CurrentUser,
  Get,
  JsonController,
  QueryParams,
} from "routing-controllers"
import { SearchService } from "./SearchService"
import { SearchParams } from "./types/SearchParams"

@JsonController("/search")
export class SearchController {
  constructor(private searchService = new SearchService()) {}

  @Get()
  async search(
    @CurrentUser({ required: true }) user: User,
    @QueryParams({ required: true }) searchParams: SearchParams
  ) {
    return this.searchService.overallSearch(searchParams, user.id)
  }
}
