import { Rating } from "@prisma/client"
import { InternalServerError } from "routing-controllers"
import { InterestRepository } from "../interest/InterestRepository"
import { RatingRepository } from "../rating/RatingRepository"
import { SimpleUserDto } from "../user/types/SimpleUserDto"
import { UserSimilarityDto } from "./types/UserSimilarityDto"

export class UserSimilarityService {
  constructor(
    private ratingRepo = new RatingRepository(),
    private interestRepo = new InterestRepository()
  ) {}

  async findSimilarUsers(requesterId: string) {
    const requesterRatings = await this.ratingRepo.findRatingsByUserId(
      requesterId
    )

    const requesterHighInterests = await this.interestRepo.findHighInterestsByUserId(
      requesterId
    )
    const highInterestImdbIds = requesterHighInterests.map((i) =>
      String(i.syncroItemId)
    )

    const imdbItemIds = requesterRatings
      .filter((r) => typeof r.syncroItemId !== null)
      .map((r) => String(r.syncroItemId))

    const usersWhoRatedSameItems = await this.ratingRepo.findUsersWhoRatedSameItems(
      requesterId,
      imdbItemIds
    )

    const usersWhoHighInterestsSameItems = await this.interestRepo.findUsersWhoHighInteretSameItems(
      requesterId,
      highInterestImdbIds
    )

    const similarities = await Promise.all(
      usersWhoRatedSameItems.map((u) => {
        const userB = { ...u }

        // @ts-expect-error
        userB.ratings = undefined

        return this.getUserSimilarity({
          userARatings: requesterRatings,
          userB,
          userBRatings: u.ratings,
          highInterestCount:
            usersWhoHighInterestsSameItems.find((c) => c.userId === u.id)
              ?._count.userId || 0,
        })
      })
    )

    return similarities
  }

  getUserSimilarity = async (params: {
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
          (r) => r.syncroItemId === userBRating.syncroItemId
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
