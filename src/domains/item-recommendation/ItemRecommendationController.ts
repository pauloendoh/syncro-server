import { User } from "@prisma/client"
import {
  CurrentUser,
  Get,
  JsonController,
  QueryParam,
} from "routing-controllers"
import { SyncroItemType } from "../search/types/SyncroItemType/SyncroItemType"
import { ItemRecommendationService } from "./ItemRecommendationService"

@JsonController()
export class ItemRecommendationController {
  constructor(
    private recommendationService = new ItemRecommendationService()
  ) {}

  @Get("/item-recommendations-from-me")
  async search(@CurrentUser({ required: true }) user: User) {
    return this.recommendationService.findItemRecommendationsFromUser(user.id)
  }

  @Get("/items-to-recommend-to-user")
  async findItemsToRecommendToUser(
    @CurrentUser({ required: true }) requester: User,
    @QueryParam("userId") userId: string,
    @QueryParam("itemType") itemType: SyncroItemType
  ) {
    return this.recommendationService.findItemsToRecommendToUser({
      requesterId: requester.id,
      userId,
      itemType,
    })
  }
}
