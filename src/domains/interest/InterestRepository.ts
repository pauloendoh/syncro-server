import { Interest, SyncroItemType } from "@prisma/client"
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
        syncroItemId: {
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

  saveItem(itemId: string, requesterId: string) {
    return this.prismaClient.interest.create({
      data: {
        userId: requesterId,
        syncroItemId: itemId,
        interestLevel: 3,
      },
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
          syncroItemId: {
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

  async findSavedItems(userId: string) {
    return this.prismaClient.interest.findMany({
      where: {
        userId,
      },
      include: {
        syncroItem: true,
      },
    })
  }

  async findSavedItemsByType(userId: string, type: SyncroItemType) {
    return this.prismaClient.interest.findMany({
      where: {
        userId,
        syncroItem: {
          type,
        },
      },
      include: {
        syncroItem: true,
      },
    })
  }
}
