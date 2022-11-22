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
        itemRecommendation: {
          include: {
            item: true,
            user: {
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

  async createItemRecommendationNotification(options: {
    requesterId: string
    itemId: string
    userId: string
  }) {
    const itemRecommendation = await this.prismaClient.itemRecommendation.create(
      {
        data: {
          userId: options.requesterId,
          itemId: options.itemId,
        },
      }
    )

    return this.prismaClient.notification.create({
      data: {
        userId: options.userId,
        itemRecommendationId: itemRecommendation.id,
      },
    })
  }
}
