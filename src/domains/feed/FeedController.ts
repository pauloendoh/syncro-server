import { User } from "@prisma/client"
import { CurrentUser, Get, JsonController } from "routing-controllers"
import { FeedService } from "./FeedService"

@JsonController()
export class ImdbItemController {
  constructor(private feedService = new FeedService()) {}

  @Get("/feed/home-ratings")
  async findHomeItems(@CurrentUser({ required: true }) user: User) {
    return this.feedService.findHomeItems(user.id)
  }
}
