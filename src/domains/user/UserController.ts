import { User } from "@prisma/client"
import { CurrentUser, Get, JsonController, Param } from "routing-controllers"
import { UserService } from "./UserService"

@JsonController()
export class UserController {
  constructor(private userService = new UserService()) {}

  @Get("/user/:userId")
  async findUserInfo(
    @Param("userId") userId: string,
    @CurrentUser({ required: true }) user: User
  ) {
    return this.userService.findUserInfo(userId)
  }

  @Get("/user/:userId/items")
  async findUserItems(
    @Param("userId") userId: string,
    @CurrentUser({ required: true }) requester: User
  ) {
    return this.userService.findUserItems(userId, requester.id)
  }
}
