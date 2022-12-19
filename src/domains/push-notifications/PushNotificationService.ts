import { Notification } from "@prisma/client"
import Expo, { ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk"
import { myExpo } from "../../utils/myExpo"
import { UserTokenRepository } from "../user-token/UserTokenRepository"

export class PushNotificationService {
  constructor(private tokenRepo = new UserTokenRepository()) {}

  async createFinishRatingImportNotification(notification: Notification) {
    const pushTokens = await this.tokenRepo.findUserNotificationTokens(
      notification.userId
    )

    const messages: ExpoPushMessage[] = []
    for (const pushToken of pushTokens) {
      if (!Expo.isExpoPushToken(pushToken.token)) {
        console.error(
          `Push token ${pushToken.token} is not a valid Expo push token`
        )
        continue
      }

      messages.push({
        to: pushToken.token,
        sound: "default",
        title: "Ratings import finished!",
        data: notification,
      })
    }

    // PE 1/3 - DRY?
    let chunks = myExpo.chunkPushNotifications(messages)
    const tickets: ExpoPushTicket[] = []

    for (let chunk of chunks) {
      try {
        let ticketChunk = await myExpo.sendPushNotificationsAsync(chunk)
        console.log(ticketChunk)
        tickets.push(...ticketChunk)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
