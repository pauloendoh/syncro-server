import Expo, { ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk"
import { NotFoundError404 } from "../../../utils/errors/NotFoundError404"
import { myExpo } from "../../../utils/myExpo"
import { pushNotificationTitles } from "../../../utils/pushNotificationTitles"
import { SyncroItemRepository } from "../../syncro-item/SyncroItemRepository"
import { UserTokenRepository } from "../../user-token/UserTokenRepository"
import { UserRepository } from "../../user/UserRepository"

type ExecParams = { requesterId: string; itemId: string; userId: string }

export class UseItemRecommendationPushNotification {
  constructor(
    private userRepo = new UserRepository(),
    private tokenRepo = new UserTokenRepository(),
    private itemRepo = new SyncroItemRepository()
  ) {}

  exec = async ({ requesterId, itemId, userId }: ExecParams) => {
    const requester = await this.userRepo.findUserById(requesterId)
    const pushTokens = await this.tokenRepo.findUserNotificationTokens(userId)
    const item = await this.itemRepo.findImdbItemById(itemId)
    if (!requester || !item)
      throw new NotFoundError404("Requester or item not found.")

    const messages: ExpoPushMessage[] = []
    for (const pushToken of pushTokens) {
      // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

      // Check that all your push tokens appear to be valid Expo push tokens
      if (!Expo.isExpoPushToken(pushToken.token)) {
        console.error(
          `Push token ${pushToken.token} is not a valid Expo push token`
        )
        continue
      }

      // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
      messages.push({
        to: pushToken.token,
        sound: "default",
        title: pushNotificationTitles.userItemRecommendation,
        body: `${requester.username} suggested ${item.title}`,
      })
    }

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
