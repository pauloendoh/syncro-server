import { User } from "@prisma/client"
import {
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
  QueryParam,
} from "routing-controllers"
import { ImdbItemService } from "./ImdbItemService"
import { UseRecommendItem } from "./useCases/UseRecommendItem"

@JsonController()
export class ImdbItemController {
  constructor(
    private imdbItemService = new ImdbItemService(),
    private _recommendItem = new UseRecommendItem()
  ) {}

  @Get("/imdb-item")
  async search(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("id", { required: true }) id: string
  ) {
    return this.imdbItemService.findAndSaveDetails(id)
  }

  @Get("/user/:id/imdb-items")
  async findImdbItemsRatedByUserId(
    @CurrentUser({ required: true }) user: User,
    @Param("id") userId: string
  ) {
    return this.imdbItemService.findImdbItemsRatedByUserId(userId)
  }

  @Post("/recommend-item")
  async recommendItem(
    @CurrentUser({ required: true }) requester: User,
    @QueryParam("itemId", { required: true }) itemId: string,
    @QueryParam("userId", { required: true }) userId: string
  ) {
    return this._recommendItem.exec({
      itemId,
      requesterId: requester.id,
      userId,
    })
  }
}
