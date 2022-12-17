import myPrismaClient from "../../utils/myPrismaClient"
import { MangaCreateDto } from "./types/MangaCreateDto"

export class MangaRepository {
  constructor(private prismaClient = myPrismaClient) {}

  async findMangasByUrls(urls: string[]) {
    return this.prismaClient.syncroItem.findMany({
      where: {
        mangaMalUrl: {
          in: urls,
        },
      },
    })
  }

  async createMangas(mangas: MangaCreateDto[]) {
    return this.prismaClient.$transaction(
      mangas.map((manga) =>
        this.prismaClient.syncroItem.create({
          data: {
            mangaMalUrl: manga.mangaMalUrl,
            title: manga.title,
            imageUrl: manga.image,
            avgRating: manga.avgRating,
            ratingCount: manga.ratingCount,
            type: "manga",
            plotSummary: manga.summary,
          },
        })
      )
    )
  }
}
