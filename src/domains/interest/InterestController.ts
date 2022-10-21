import { Interest, User } from "@prisma/client"
import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
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
}
