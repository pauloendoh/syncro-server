import { Interest, SyncroItemType, User } from "@prisma/client"
import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
  QueryParam,
} from "routing-controllers"
import { InterestService } from "./InterestService"

@JsonController()
export class InterestController {
  constructor(private interestService = new InterestService()) {}

  @Get("/me/interests")
  async findMyInterests(@CurrentUser({ required: true }) user: User) {
    return this.interestService.findInterestsByUserId(user.id)
  }

  @Get("/user/:id/interests")
  async userInterests(
    @CurrentUser({ required: true }) user: User,
    @Param("id") id: string
  ) {
    return this.interestService.findInterestsByUserId(id)
  }

  @Post("/me/interests")
  async saveInterest(
    @CurrentUser({ required: true }) user: User,
    @Body() body: Interest
  ) {
    return this.interestService.saveInterest(body, user.id)
  }

  @Post("/toggle-save/item")
  async toggleSaveItem(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("id") id: string
  ) {
    return this.interestService.toggleSaveItem(id, user.id)
  }

  @Get("/saved-items")
  async findSavedItems(@CurrentUser({ required: true }) user: User) {
    return this.interestService.findSavedItems(user.id)
  }

  @Get("/saved-items")
  async findSavedItemsByType(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("type", { required: true }) type: SyncroItemType
  ) {
    return this.interestService.findSavedItemsByType(user.id, type)
  }
}
