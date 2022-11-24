import { Follow } from "@prisma/client"
import { UseCreateFollowPushNotification } from "../push-notifications/useCases/UseCreateFollowPushNotification"
import { NotificationRepository } from "./NotificationRepository"

export class NotificationService {
  constructor(
    private notificationRepo = new NotificationRepository(),
    private createFollowPushNotification = new UseCreateFollowPushNotification()
  ) {}

  async findNotificationsByUserId(userId: string) {
    return this.notificationRepo.findNotificationsByUserId(userId)
  }

  async createFollowNotification(follow: Follow) {
    this.createFollowPushNotification.exec({ follow })

    return this.notificationRepo.createFollowNotification(follow)
  }

  async hideUserNotificationsDots(userId: string) {
    await this.notificationRepo.hideUserNotificationsDots(userId)

    return this.notificationRepo.findNotificationsByUserId(userId)
  }
}
