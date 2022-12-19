import { User } from "@prisma/client"
import { CurrentUser, Get, JsonController, Param } from "routing-controllers"
import { RatingsImportService } from "./RatingsImportService"

@JsonController()
export class RatingsImportController {
  constructor(private ratingsImportService = new RatingsImportService()) {}

  @Get("/import-request/:requestId/import-items")
  async getImportItems(
    @CurrentUser({ required: true }) user: User,
    @Param("requestId") requestId: string
  ) {
    return this.ratingsImportService.getImportItemsByRequestId(
      requestId,
      user.id
    )
  }
}
