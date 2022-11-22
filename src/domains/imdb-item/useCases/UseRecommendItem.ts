import { NotificationRepository } from "../../notification/NotificationRepository"

type ExecParams = { requesterId: string; itemId: string; userId: string }

export class UseRecommendItem {
  constructor(private notificationRepo = new NotificationRepository()) {}

  exec = async ({ requesterId, itemId, userId }: ExecParams) => {
    return this.notificationRepo.createItemRecommendationNotification({
      itemId,
      userId,
      requesterId,
    })
  }
}
