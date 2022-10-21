import myPrismaClient from "../../utils/myPrismaClient"

export class FeedRepository {
  constructor(private prismaClient = myPrismaClient) {}

  findHomeItems = async (requesterId: string) => {
    return this.prismaClient.rating.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
        imdbItem: true,
      },
      where: {
        userId: requesterId,
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
