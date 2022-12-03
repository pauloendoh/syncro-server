import { SyncroItem, SyncroItemType } from "@prisma/client"
import myPrismaClient from "../../utils/myPrismaClient"
import { IgdbCreateDto } from "../search/types/IgdbCreateDto"
import { ImdbItemDetailsResponse } from "./types/ImdbItemDetailsGetDto"

export class SyncroItemRepository {
  constructor(private prismaClient = myPrismaClient) {}

  findSyncroItemById(id: string) {
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

  findItemsRatedByUser(userId: string) {
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

  async findGamesByUrls(urls: string[]) {
    return this.prismaClient.syncroItem.findMany({
      where: {
        igdbUrl: {
          in: urls,
        },
      },
    })
  }

  async createGames(games: IgdbCreateDto[]) {
    return this.prismaClient.$transaction(
      games.map((game) =>
        this.prismaClient.syncroItem.create({
          data: {
            igdbUrl: game.igdbUrl,
            title: game.title,
            imageUrl: game.image,
            avgRating: 0,
            ratingCount: 0,
            type: "game",
          },
        })
      )
    )
  }

  async updateSyncroItem(item: SyncroItem) {
    return this.prismaClient.syncroItem.update({
      data: item,
      where: {
        id: item.id,
      },
    })
  }
}
