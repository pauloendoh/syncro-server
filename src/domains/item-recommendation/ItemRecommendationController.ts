import { User } from "@prisma/client"
import { CurrentUser, Get, JsonController } from "routing-controllers"
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
}
