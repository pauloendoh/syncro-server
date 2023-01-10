import { User } from "@prisma/client"
import {
  CurrentUser,
  Get,
  JsonController,
  Post,
  Put,
  QueryParam,
} from "routing-controllers"
import { SyncroItemService } from "./SyncroItemService"
import { UseRecommendItem } from "./syncroItemUseCases/UseRecommendItem"

@JsonController()
export class SyncroItemController {
  constructor(
    private syncroItemService = new SyncroItemService(),
    private _recommendItem = new UseRecommendItem()
  ) {}

  @Get("/syncro-item")
  async search(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("id", { required: true }) id: string
  ) {
    return this.syncroItemService.findAndSaveDetails(id)
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

  @Put("/syncro-item/rating")
  async updateItemRating(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("id", { required: true }) id: string
  ) {
    return this.syncroItemService.updateItemRating(id)
  }
}
