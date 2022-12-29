import { Rating } from "@prisma/client"
import myPrismaClient from "../../utils/myPrismaClient"
import { userSelectFields } from "../../utils/prisma/fields/user/userSelectFields"

export class RatingRepository {
  constructor(private prismaClient = myPrismaClient) {}

  findRatingsByUserId(userId: string) {
    return this.prismaClient.rating.findMany({
      where: {
        userId,
      },
    })
  }

  findRatingsByUsersIds(usersIds: string[]) {
    return this.prismaClient.rating.findMany({
      where: {
        userId: {
          in: usersIds,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  findRatingsByUserIdAndItemsIds(userId: string, itemsIds: string[]) {
    return this.prismaClient.rating.findMany({
      where: {
        userId,
        syncroItemId: {
          in: itemsIds,
        },
      },
    })
  }

  createRating(rating: Rating) {
    return this.prismaClient.rating.create({
      data: { ...rating, id: undefined },
    })
  }

  updateRating(rating: Rating) {
    return this.prismaClient.rating.update({
      data: rating,
      where: {
        id: rating.id,
      },
    })
  }

  deleteRating(ratingId: string) {
    return this.prismaClient.rating.delete({
      where: {
        id: ratingId,
      },
    })
  }

  userOwnsRating(userId: string, ratingId: string) {
    return this.prismaClient.rating.findFirst({
      where: {
        id: ratingId,
        userId,
      },
    })
  }

  findUsersWhoRatedSameItems(
    requesterId: string,
    requesterImdbItemIds: string[]
  ) {
    return this.prismaClient.user.findMany({
      where: {
        NOT: {
          id: requesterId,
        },
        ratings: {
          some: {
            syncroItemId: {
              in: requesterImdbItemIds,
            },
          },
        },
      },

      select: {
        ...userSelectFields,
        ratings: {
          where: {
            syncroItemId: {
              in: requesterImdbItemIds,
            },
          },
        },
      },
    })
  }

  async upsertRating(params: {
    itemId: string
    ratingValue: number
    userId: string
  }) {
    const found = await this.prismaClient.rating.findFirst({
      where: {
        userId: params.userId,
        syncroItemId: params.itemId,
      },
    })

    if (found) {
      return this.updateRating({
        ...found,
        ratingValue: params.ratingValue,
      })
    }

    return this.prismaClient.rating.create({
      data: {
        ratingValue: params.ratingValue,
        syncroItemId: params.itemId,
        userId: params.userId,
      },
    })
  }

  async alreadyRated(userId: string, itemId: string) {
    const found = await this.prismaClient.rating.findFirst({
      where: {
        userId,
        syncroItemId: itemId,
      },
    })

    return !!found
  }
}
