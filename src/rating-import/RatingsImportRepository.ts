import { RatingsImportItem, RatingsImportRequestStatus } from "@prisma/client"
import myPrismaClient from "../utils/myPrismaClient"

export class RatingsImportRepository {
  constructor(private prismaClient = myPrismaClient) {}

  async createRatingImportRequest(requesterId: string, itemsQty: number) {
    return this.prismaClient.ratingsImportRequest.create({
      data: {
        userId: requesterId,
        remainingItemsQty: itemsQty,
      },
    })
  }

  async createImportItems(params: {
    items: { title: string; url: string; rating: number }[]
    importRequestId: string
    requesterId: string
  }) {
    const { items, importRequestId: requestId, requesterId } = params
    return this.prismaClient.$transaction(
      items.map((item) =>
        this.prismaClient.ratingsImportItem.create({
          data: {
            originalLink: item.url,
            originalTitle: item.title,
            ratingValue: item.rating,
            requestId,
            userId: requesterId,
          },
        })
      )
    )
  }

  async updateImportItem(item: RatingsImportItem) {
    return this.prismaClient.ratingsImportItem.update({
      where: {
        id: item.id,
      },
      data: {
        ...item,
        updatedAt: undefined,
      },
    })
  }

  async decrementRemainingItemsQty(requestId: string) {
    return this.prismaClient.ratingsImportRequest.update({
      where: {
        id: requestId,
      },
      data: {
        remainingItemsQty: {
          decrement: 1,
        },
      },
    })
  }

  async findImportRequestById(id: string) {
    return this.prismaClient.ratingsImportRequest.findFirst({
      where: {
        id,
      },
    })
  }

  async findImportItemsByRequestId(requestId: string, userId: string) {
    return this.prismaClient.ratingsImportItem.findMany({
      where: {
        requestId,
        syncroItem: {
          ratings: {
            some: {
              userId,
            },
          },
        },
      },
      include: {
        syncroItem: true,
      },
    })
  }

  async updateImportRequestStatus(
    requestId: string,
    status: RatingsImportRequestStatus
  ) {
    return this.prismaClient.ratingsImportRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status,
      },
    })
  }
}
