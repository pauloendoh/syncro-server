import { User } from "@prisma/client"
import {
  CurrentUser,
  Get,
  JsonController,
  Param,
  QueryParam,
} from "routing-controllers"
import { ImdbItemService } from "./ImdbItemService"

@JsonController()
export class ImdbItemController {
  constructor(private imdbItemService = new ImdbItemService()) {}

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
}
