import { Rating } from "@prisma/client"
import { InternalServerError } from "routing-controllers"
import { SimpleUserDto } from "../../follow/types/SimpleUserDto"
import { UserSimilarityDto } from "../types/UserSimilarityDto"

export class useGetUserSimilarity {
  exec = async (params: {
    userARatings: Rating[]
    userB: SimpleUserDto
    userBRatings: Rating[]
    highInterestCount: number
  }): Promise<UserSimilarityDto> => {
    const { userARatings, userB, userBRatings, highInterestCount } = params

    const ratedSameItemsCount = userBRatings.length
    const percentageQuantityFromUserA =
      ratedSameItemsCount / userARatings.length

    const sumSimilarityPercentage = userBRatings.reduce(
      (resultSumPercentage, userBRating) => {
        const userARating = userARatings.find(
          (r) => r.imdbItemId === userBRating.imdbItemId
        )

        if (!userARating)
          throw new InternalServerError("This should not happen")

        const percentage = this.calculateRatingSimilarityPercentage(
          userARating?.ratingValue,
          userBRating.ratingValue
        )

        return resultSumPercentage + percentage
      },
      0
    )

    const ratingsSimilarityAvgPercentage =
      sumSimilarityPercentage / userBRatings.length

    const overallPercentage =
      (ratingsSimilarityAvgPercentage + percentageQuantityFromUserA) / 2

    return {
      userB,
      userARatedCount: userARatings.length,
      ratingsSimilarityAvgPercentage,
      ratedSameItemsCount,
      percentageQuantityFromUserA,
      overallPercentage,
      highInterestCount,
    }
  }

  calculateRatingSimilarityPercentage(ratingA: number, ratingB: number) {
    const diff = Math.abs(ratingA - ratingB) // example: 10 - 6 = 4
    const top = 9 - diff // 9 - 4 = 5
    const percentage = top / 9 // 5 / 9 = 0.55

    return percentage // therefore, 10 and 6 are 55% similar.
  }
}
