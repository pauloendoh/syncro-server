import { User } from "@prisma/client"
import {
  CurrentUser,
  Get,
  JsonController,
  QueryParams,
} from "routing-controllers"
import { ImdbSearchService } from "./ImdbSearchService"
import { SearchParams } from "./types/SearchParams"

@JsonController("/search")
export class ImdbSearchController {
  constructor(private searchService = new ImdbSearchService()) {}

  @Get()
  async search(
    @CurrentUser({ required: true }) user: User,
    @QueryParams({ required: true }) searchParams: SearchParams
  ) {
    return this.searchService.searchSeries(searchParams, user.id)
  }
}
