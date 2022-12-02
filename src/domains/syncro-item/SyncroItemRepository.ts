import { SyncroItemType } from "@prisma/client"
import myPrismaClient from "../../utils/myPrismaClient"
import { ImdbItemDetailsResponse } from "./types/ImdbItemDetailsGetDto"

export class SyncroItemRepository {
  constructor(private prismaClient = myPrismaClient) {}

  findImdbItemById(id: string) {
    return this.prismaClient.syncroItem.findFirst({
      where: {
        id,
      },
    })
  }

  createFromImdbSearch(id: string, data: ImdbItemDetailsResponse) {
    return this.prismaClient.syncroItem.create({
      data: {
        id,
        avgRating: data.ratings?.rating || 0,
        imageUrl: data.title.image?.url,
        ratingCount: data.ratings?.ratingCount || 0,
        title: data.title.title,
        type: data.title.titleType as SyncroItemType,
        year: data.title.year,
        plotSummary: data.plotOutline?.text || data.plotSummary?.text,
      },
    })
  }

  findImdbItemsRatedByUserId(userId: string) {
    return this.prismaClient.syncroItem.findMany({
      include: {
        ratings: true,
      },
      where: {
        ratings: {
          some: {
            userId,
          },
        },
      },
    })
  }

  findImdbItemsByIds(imdbIds: string[]) {
    return this.prismaClient.syncroItem.findMany({
      where: {
        id: {
          in: imdbIds,
        },
      },
    })
  }
}
