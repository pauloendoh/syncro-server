import { User } from "@prisma/client"
import {
  CurrentUser,
  Get,
  JsonController,
  QueryParam,
} from "routing-controllers"
import { ImdbItemService } from "./ImdbItemService"

@JsonController("/imdb-item")
export class ImdbItemController {
  constructor(private imdbItemService = new ImdbItemService()) {}

  @Get("/")
  async search(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("id", { required: true }) id: string
  ) {
    return this.imdbItemService.findAndSaveDetails(id)
  }
}
