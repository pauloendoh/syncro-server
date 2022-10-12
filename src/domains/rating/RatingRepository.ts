import { Rating } from "@prisma/client"
import myPrismaClient from "../../utils/myPrismaClient"

export class RatingRepository {
  constructor(private prismaClient = myPrismaClient) {}

  findRatingsByUserId(userId: string) {
    return this.prismaClient.rating.findMany({
      where: {
        userId,
      },
    })
  }

  createRating(rating: Rating) {
    return this.prismaClient.rating.create({
      data: { ...rating, id: undefined },
    })
  }

  updateRating(rating: Rating) {
    return this.prismaClient.rating.update({
      data: rating,
      where: {
        id: rating.id,
      },
    })
  }

  deleteRating(ratingId: string) {
    return this.prismaClient.rating.delete({
      where: {
        id: ratingId,
      },
    })
  }

  userOwnsRating(userId: string, ratingId: string) {
    return this.prismaClient.rating.findFirst({
      where: {
        id: ratingId,
        userId,
      },
    })
  }
}
