import myPrismaClient from "../../utils/myPrismaClient"

export class ItemRecommendationRepository {
  constructor(private prismaClient = myPrismaClient) {}

  async findItemRecommendationsFromUser(fromUserId: string) {
    return this.prismaClient.itemRecommendation.findMany({
      where: {
        fromUserId,
      },
    })
  }
}
