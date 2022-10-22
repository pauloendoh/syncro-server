import { User } from "@prisma/client"
import {
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
} from "routing-controllers"
import { FollowService } from "./FollowService"

@JsonController()
export class FollowController {
  constructor(private followService = new FollowService()) {}

  @Post("/user/:id/toggle-follow")
  async toggleFollowUser(
    @Param("id") userId: string,
    @CurrentUser({ required: true }) requester: User
  ) {
    return this.followService.toggleFollow(requester.id, userId)
  }

  @Get("/me/following-users")
  async findMyFollowingUsers(@CurrentUser({ required: true }) requester: User) {
    return this.followService.findFollowingUsers(requester.id)
  }
}
