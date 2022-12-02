import { NotificationRepository } from "../../notification/NotificationRepository"
import { UseItemRecommendationPushNotification } from "../../push-notifications/useCases/UseItemRecommendationPushNotification"

type ExecParams = { requesterId: string; itemId: string; userId: string }

export class UseRecommendItem {
  constructor(
    private notificationRepo = new NotificationRepository(),
    private useItemRecommendationPushNotification = new UseItemRecommendationPushNotification()
  ) {}

  exec = async ({ requesterId, itemId, userId }: ExecParams) => {
    const itemRecommendation = await this.notificationRepo.createItemRecommendationNotification(
      {
        itemId,
        userId,
        requesterId,
      }
    )

    this.useItemRecommendationPushNotification.exec({
      itemId,
      userId,
      requesterId,
    })

    return itemRecommendation
  }
}
