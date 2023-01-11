import { User } from "@prisma/client"
import {
  CurrentUser,
  Get,
  JsonController,
  QueryParam,
} from "routing-controllers"

import { YoutubeService } from "./YoutubeService"

@JsonController()
export class YoutubeController {
  constructor(private youtubeService = new YoutubeService()) {}

  @Get("/youtube-videos")
  async searchYoutubeVideos(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("itemId", { required: true }) itemId: string
  ) {
    return this.youtubeService.searchYoutubeVideos(itemId)
  }
}
