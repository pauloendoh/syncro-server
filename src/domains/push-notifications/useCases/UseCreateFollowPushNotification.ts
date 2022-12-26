import { Follow } from "@prisma/client"
import Expo, { ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk"
import { myExpo } from "../../../utils/myExpo"
import { UserTokenRepository } from "../../user-token/UserTokenRepository"
import { UserRepository } from "../../user/UserRepository"

type ExecParams = { follow: Follow }

export class UseCreateFollowPushNotification {
  constructor(
    private userRepo = new UserRepository(),
    private tokenRepo = new UserTokenRepository()
  ) {}

  exec = async ({ follow }: ExecParams) => {
    const follower = await this.userRepo.findUserById(follow.followerId)
    const pushTokens = await this.tokenRepo.findUserNotificationTokens(
      follow.followingUserId
    )

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
        channelId: "default",
        title: "New follower!",
        body: `${follower?.username} started following you`,
        data: { withSome: "data" },
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
