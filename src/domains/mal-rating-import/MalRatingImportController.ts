import { User } from "@prisma/client"
import { CurrentUser, JsonController, Param, Post } from "routing-controllers"
import { MalRatingImportService } from "./MalRatingImportService"

@JsonController()
export class MalRatingImportController {
  constructor(private malRatingImportService = new MalRatingImportService()) {}

  @Post("/check-mal/:username")
  async checkMalUsername(
    @Param("username") username: string,
    @CurrentUser({ required: true }) requester: User
  ) {
    return this.malRatingImportService.checkMalUser(username)
  }

  @Post("/confirm-and-start-anime-import/:username")
  async confirmAndStartAnimeImport(
    @Param("username") username: string,
    @CurrentUser({ required: true }) requester: User
  ) {
    return this.malRatingImportService.startAnimeImport(requester.id, username)
  }
}
