import { Follow } from "@prisma/client"
import { RatingsImportRepository } from "../../rating-import/RatingsImportRepository"
import { NotFoundError404 } from "../../utils/errors/NotFoundError404"
import { MySocketServer } from "../../utils/socket/MySocketServer"
import { socketEvents } from "../../utils/socket/socketEvents"
import { socketRooms } from "../../utils/socket/socketRooms"
import { PushNotificationService } from "../push-notifications/PushNotificationService"
import { UseCreateFollowPushNotification } from "../push-notifications/useCases/UseCreateFollowPushNotification"
import { NotificationRepository } from "./NotificationRepository"

export class NotificationService {
  constructor(
    private notificationRepo = new NotificationRepository(),
    private createFollowPushNotification = new UseCreateFollowPushNotification(),
    private ratingImportRepository = new RatingsImportRepository(),
    private pushNotificationService = new PushNotificationService(),
    private socketServer = MySocketServer.getInstance()
  ) {}

  async findNotificationsByUserId(userId: string) {
    return this.notificationRepo.findNotificationsByUserId(userId)
  }

  async createFollowNotification(follow: Follow) {
    this.createFollowPushNotification.exec({ follow })

    const notification = await this.notificationRepo.createFollowNotification(
      follow
    )

    this.socketServer
      .to(socketRooms.userRoom(follow.followingUserId))
      .emit(socketEvents.newNotification, notification)

    return notification
  }

  async hideUserNotificationsDots(userId: string) {
    await this.notificationRepo.hideUserNotificationsDots(userId)

    return this.notificationRepo.findNotificationsByUserId(userId)
  }

  async createFinishRatingImportNotification(importRequestId: string) {
    const request = await this.ratingImportRepository.findImportRequestById(
      importRequestId
    )
    if (!request) throw new NotFoundError404("Request not found.")

    const notification = await this.notificationRepo.createFinishRatingImportNotification(
      request
    )

    this.pushNotificationService.createFinishRatingImportNotification(
      notification
    )

    return notification
  }
}
