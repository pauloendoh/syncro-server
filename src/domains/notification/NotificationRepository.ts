import { Follow } from "@prisma/client"
import myPrismaClient from "../../utils/myPrismaClient"
import { userSelectFields } from "../../utils/prisma/fields/user/userSelectFields"

export class NotificationRepository {
  constructor(private prismaClient = myPrismaClient) {}

  async findNotificationsByUserId(userId: string) {
    return this.prismaClient.notification.findMany({
      where: {
        userId,
      },
      include: {
        follow: {
          include: {
            follower: {
              select: userSelectFields,
            },
          },
        },
      },
    })
  }

  async createFollowNotification(follow: Follow) {
    return this.prismaClient.notification.create({
      data: {
        followId: follow.id,
        userId: follow.followingUserId,
      },
    })
  }

  async hideUserNotificationsDots(userId: string) {
    return this.prismaClient.notification.updateMany({
      data: {
        showDot: false,
      },
      where: {
        userId,
      },
    })
  }
}
