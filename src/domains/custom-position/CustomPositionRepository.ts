import { CustomPosition, SyncroItemType } from "@prisma/client"
import myPrismaClient from "../../utils/myPrismaClient"

export class CustomPositionRepository {
  constructor(private prismaClient = myPrismaClient) {}

  async findCustomPositionByItemId(itemId: string, requesterId: string) {
    return this.prismaClient.customPosition.findFirst({
      where: {
        userId: requesterId,
        syncroItemId: itemId,
      },
    })
  }

  async findNextAvailablePosition(
    requesterId: string,
    itemType: SyncroItemType
  ) {
    const customPosition = await this.prismaClient.customPosition.findFirst({
      where: {
        userId: requesterId,
        syncroItem: {
          type: itemType,
        },
      },
      orderBy: {
        position: "desc",
      },
    })

    if (customPosition) return customPosition.position + 1

    return 1
  }

  createCustomPosition(itemId: string, requesterId: string, position: number) {
    return this.prismaClient.customPosition.create({
      data: {
        syncroItemId: itemId,
        userId: requesterId,
        position,
      },
    })
  }

  async findCustomPositionsByItemType(
    requesterId: string,
    syncroItemType: SyncroItemType
  ) {
    return this.prismaClient.customPosition.findMany({
      where: {
        userId: requesterId,
        syncroItem: {
          type: syncroItemType,
        },
      },
      orderBy: {
        position: "asc",
      },
    })
  }

  async findCustomPositionById(id: string) {
    return this.prismaClient.customPosition.findFirst({
      where: {
        id,
      },
    })
  }

  async findCustomPositionImdbItemTypeById(id: string) {
    const found = await this.prismaClient.customPosition.findFirst({
      where: {
        id,
      },
      include: {
        syncroItem: {
          select: {
            type: true,
          },
        },
      },
    })

    return found?.syncroItem?.type || null
  }

  async saveManyCustomPositions(customPositions: CustomPosition[]) {
    return this.prismaClient.$transaction(
      customPositions.map((p) =>
        this.prismaClient.customPosition.update({
          data: p,
          where: { id: p.id },
        })
      )
    )
  }

  async checkIfRatingOrInterestExist(itemId: string, requesterId: string) {
    const rating = await this.prismaClient.rating.findFirst({
      where: {
        userId: requesterId,
        syncroItemId: itemId,
      },
    })

    const interest = await this.prismaClient.interest.findFirst({
      where: {
        userId: requesterId,
        syncroItemId: itemId,
      },
    })

    return Boolean(rating || interest)
  }

  deleteCustomPositionByItemId = (itemId: string, requesterId: string) => {
    return this.prismaClient.customPosition.deleteMany({
      where: {
        userId: requesterId,
        syncroItemId: itemId,
      },
    })
  }
}
