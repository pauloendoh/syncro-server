import { CustomPosition, SyncroItemType, User } from "@prisma/client"
import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Put,
  QueryParam,
} from "routing-controllers"
import { CustomPositionService } from "./CustomPositionService"

@JsonController()
export class CustomPositionController {
  constructor(private customPositionService = new CustomPositionService()) {}

  @Get("/custom-positions")
  async findCustomPositionsByItemType(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("itemType", { required: true }) itemType: SyncroItemType
  ) {
    return this.customPositionService.findCustomPositionsByItemType(
      user.id,
      itemType
    )
  }

  @Put("/custom-positions")
  async changeCustomPosition(
    @CurrentUser({ required: true }) user: User,
    @Body() body: CustomPosition
  ) {
    return this.customPositionService.updateCustomPosition(body, user.id)
  }
}
