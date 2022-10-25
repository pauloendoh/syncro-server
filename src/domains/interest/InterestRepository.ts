import { Interest } from "@prisma/client"
import myPrismaClient from "../../utils/myPrismaClient"

export class InterestRepository {
  constructor(private prismaClient = myPrismaClient) {}

  findInterestsByUserId(userId: string) {
    return this.prismaClient.interest.findMany({
      where: {
        userId,
      },
    })
  }

  findHighInterestsByUserId(userId: string) {
    return this.prismaClient.interest.findMany({
      where: {
        userId,
        interestLevel: {
          equals: 3,
        },
      },
    })
  }

  findInterestsByUserIdAndItemsIds(userId: string, itemsIds: string[]) {
    return this.prismaClient.interest.findMany({
      where: {
        userId,
        imdbItemId: {
          in: itemsIds,
        },
      },
    })
  }

  createInterest(interest: Interest) {
    return this.prismaClient.interest.create({
      data: { ...interest, id: undefined },
    })
  }

  updateInterest(interest: Interest) {
    return this.prismaClient.interest.update({
      data: interest,
      where: {
        id: interest.id,
      },
    })
  }

  deleteInterest(interestId: string) {
    return this.prismaClient.interest.delete({
      where: {
        id: interestId,
      },
    })
  }

  userOwnsInterest(userId: string, interestId: string) {
    return this.prismaClient.interest.findFirst({
      where: {
        id: interestId,
        userId,
      },
    })
  }

  async findUsersWhoHighInteretSameItems(
    requesterId: string,
    imdbIds: string[]
  ) {
    return this.prismaClient.interest.groupBy({
      where: {
        AND: {
          NOT: {
            userId: requesterId,
          },
          interestLevel: 3,
          imdbItemId: {
            in: imdbIds,
          },
        },
      },
      by: ["userId"],
      _count: {
        userId: true,
      },
    })
  }
}
