import { Prisma, SyncroItem, SyncroItemType } from "@prisma/client"
import myPrismaClient from "../../utils/myPrismaClient"
import { IgdbCreateDto } from "../igdb-search/types/IgdbCreateDto"
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

  async createFromImdbSearch(id: string, data: ImdbItemDetailsResponse) {
    const found = await this.prismaClient.syncroItem.findFirst({
      where: {
        id: data.id,
      },
    })

    if (found) {
      found.avgRating = data.ratings?.rating || 0
      found.imageUrl = data.title.image?.url
      found.ratingCount = data.ratings?.ratingCount || 0
      found.title = data.title.title
      found.type = data.title.titleType as SyncroItemType
      found.year = data.title.year
      found.plotSummary = data.plotOutline?.text || data.plotSummary?.text
      return this.prismaClient.syncroItem.update({
        where: {
          id: data.id,
        },
        data: found,
      })
    }
    return this.prismaClient.syncroItem.create({
      data: {
        id: data.id,
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

  findItemsRatedByUserDesc(userId: string) {
    return this.prismaClient.syncroItem.findMany({
      include: {
        ratings: {
          where: {
            userId,
          },
        },
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

  async filterItemsThatUserSaved(userId: string, itemIds: string[]) {
    return this.prismaClient.syncroItem.findMany({
      where: {
        AND: [
          {
            id: {
              in: itemIds,
            },
          },
          {
            OR: [
              {
                ratings: {
                  some: {
                    userId,
                  },
                },
              },
              {
                interests: {
                  some: {
                    userId,
                  },
                },
              },
            ],
          },
        ],
      },
    })
  }

  async createSyncroItem(createInput: Prisma.SyncroItemCreateInput) {
    return this.prismaClient.syncroItem.create({
      data: createInput,
    })
  }

  async findUserItemsCount(userId: string) {
    const items = await this.prismaClient.syncroItem.count({
      where: {
        OR: [
          {
            ratings: {
              some: {
                userId,
              },
            },
          },
          {
            interests: {
              some: {
                userId,
              },
            },
          },
        ],
      },
    })

    return items
  }
}
