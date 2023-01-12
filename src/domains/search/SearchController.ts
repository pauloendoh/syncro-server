import { User } from "@prisma/client"
import {
  CurrentUser,
  Get,
  JsonController,
  QueryParams,
} from "routing-controllers"
import { SearchParams } from "../_shared/types/SearchParams"
import { SearchService } from "./SearchService"

@JsonController()
export class SearchController {
  constructor(private searchService = new SearchService()) {}

  @Get("/search")
  async search(
    @CurrentUser({ required: true }) user: User,
    @QueryParams({ required: true }) searchParams: SearchParams
  ) {
    return this.searchService.overallSearch(searchParams, user.id)
  }

  @Get("/search/google")
  async googleSearch(
    // @CurrentUser({ required: true }) user: User,
    @QueryParams({ required: true }) searchParams: SearchParams
  ) {
    return this.searchService.googleSearch(searchParams)
  }

  @Get("/search-more")
  async searchMore(
    @CurrentUser({ required: true }) user: User,
    @QueryParams({ required: true }) searchParams: SearchParams
  ) {
    return this.searchService.searchMore(searchParams)
  }
}
