import { Follow } from "@prisma/client"
import { NotificationRepository } from "./NotificationRepository"

export class NotificationService {
  constructor(private notificationRepo = new NotificationRepository()) {}

  async findNotificationsByUserId(userId: string) {
    return this.notificationRepo.findNotificationsByUserId(userId)
  }

  async createFollowNotification(follow: Follow) {
    return this.notificationRepo.createFollowNotification(follow)
  }

  async hideUserNotificationsDots(userId: string) {
    await this.notificationRepo.hideUserNotificationsDots(userId)

    return this.notificationRepo.findNotificationsByUserId(userId)
  }
}
