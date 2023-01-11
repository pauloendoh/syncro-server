import { User } from "@prisma/client"
import {
  CurrentUser,
  Get,
  JsonController,
  QueryParam,
} from "routing-controllers"

import { MangaService } from "./MangaService"

@JsonController()
export class MangaController {
  constructor(private mangaService = new MangaService()) {}

  @Get("/manga-panels")
  async searchYoutubeVideos(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("itemId", { required: true }) itemId: string
  ) {
    return this.mangaService.findMangaPanels(itemId)
  }
}
