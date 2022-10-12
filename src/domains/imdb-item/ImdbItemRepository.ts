import { ImdbItemType } from "@prisma/client"
import myPrismaClient from "../../utils/myPrismaClient"
import { ImdbItemDetailsResponse } from "./types/ImdbItemDetailsGetDto"

export class ImdbItemRepository {
  constructor(private prismaClient = myPrismaClient) {}

  findImdbItemById(id: string) {
    return this.prismaClient.imdbItem.findFirst({
      where: {
        id,
      },
    })
  }

  createFromImdbSearch(id: string, data: ImdbItemDetailsResponse) {
    return this.prismaClient.imdbItem.create({
      data: {
        id,
        avgRating: data.ratings?.rating || 0,
        imageUrl: data.title.image.url,
        ratingCount: data.ratings?.ratingCount || 0,
        title: data.title.title,
        type: data.title.titleType as ImdbItemType,
        year: data.title.year,
        plotSummary: data.plotOutline?.text || data.plotSummary?.text,
      },
    })
  }
}
