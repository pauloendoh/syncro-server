import { User } from "@prisma/client"
import {
  CurrentUser,
  Get,
  JsonController,
  QueryParams,
} from "routing-controllers"
import { SearchParams } from "../_shared/types/SearchParams"
import { SearchService } from "./SearchService"

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

  @Get("/google")
  async googleSearch(
    // @CurrentUser({ required: true }) user: User,
    @QueryParams({ required: true }) searchParams: SearchParams
  ) {
    return this.searchService.googleSearch(searchParams)
  }
}
