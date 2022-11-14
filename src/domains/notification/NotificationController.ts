import { User } from "@prisma/client"
import { All, CurrentUser, Get, JsonController } from "routing-controllers"
import { NotificationService } from "./NotificationService"

@JsonController()
export class NotificationController {
  constructor(private notificationService = new NotificationService()) {}

  @Get("/notifications")
  async findMyFollowingUsers(@CurrentUser({ required: true }) requester: User) {
    return this.notificationService.findNotificationsByUserId(requester.id)
  }

  @All("/notifications/hide-dots")
  hideNotificationDots(@CurrentUser({ required: true }) user: User) {
    return this.notificationService.hideUserNotificationsDots(user.id)
  }
}
