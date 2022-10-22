import myPrismaClient from "../../utils/myPrismaClient"
import { userSelectFields } from "../../utils/prisma/fields/user/userSelectFields"

export class FeedRepository {
  constructor(private prismaClient = myPrismaClient) {}

  findHomeRatingsByUsersIds = async (usersIds: string[]) => {
    return this.prismaClient.rating.findMany({
      include: {
        user: {
          select: userSelectFields,
        },
        imdbItem: true,
      },
      where: {
        userId: {
          in: usersIds,
        },
        ratingValue: {
          gt: 0,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }
}
