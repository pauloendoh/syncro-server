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

  saveItem(params: { itemId: string; requesterId: string; position: number }) {
    return this.prismaClient.interest.create({
      data: {
        userId: params.requesterId,
        syncroItemId: params.itemId,
        position: params.position,
        interestLevel: 3,
      },
    })
  }

  updateMany(interests: Interest[]) {
    return this.prismaClient.$transaction(
      interests.map((i) =>
        this.prismaClient.interest.update({
          where: {
            id: i.id,
          },
          data: {
            position: i.position,
          },
        })
      )
    )
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
      orderBy: {
        position: "asc",
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
      orderBy: {
        position: "asc",
      },
    })
  }

  async findByIdAndUserId(id: string, userId: string) {
    return this.prismaClient.interest.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        syncroItem: true,
      },
    })
  }
}
