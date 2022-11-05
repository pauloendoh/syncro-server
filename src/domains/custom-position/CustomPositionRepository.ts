import { CustomPosition, ImdbItemType } from "@prisma/client"
import myPrismaClient from "../../utils/myPrismaClient"

export class CustomPositionRepository {
  constructor(private prismaClient = myPrismaClient) {}

  async findCustomPositionByItemId(itemId: string, requesterId: string) {
    return this.prismaClient.customPosition.findFirst({
      where: {
        userId: requesterId,
        imdbItemId: itemId,
      },
    })
  }

  async findNextAvailablePosition(requesterId: string, itemType: ImdbItemType) {
    const customPosition = await this.prismaClient.customPosition.findFirst({
      where: {
        userId: requesterId,
        imdbItem: {
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
        imdbItemId: itemId,
        userId: requesterId,
        position,
      },
    })
  }

  async findCustomPositionsByItemType(
    requesterId: string,
    imdbItemType: ImdbItemType
  ) {
    return this.prismaClient.customPosition.findMany({
      where: {
        userId: requesterId,
        imdbItem: {
          type: imdbItemType,
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
        imdbItem: {
          select: {
            type: true,
          },
        },
      },
    })

    return found?.imdbItem?.type || null
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
        imdbItemId: itemId,
      },
    })

    const interest = await this.prismaClient.interest.findFirst({
      where: {
        userId: requesterId,
        imdbItemId: itemId,
      },
    })

    return Boolean(rating || interest)
  }

  deleteCustomPositionByItemId = (itemId: string, requesterId: string) => {
    return this.prismaClient.customPosition.deleteMany({
      where: {
        userId: requesterId,
        imdbItemId: itemId,
      },
    })
  }
}
