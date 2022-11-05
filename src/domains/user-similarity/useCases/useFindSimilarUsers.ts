import { InterestRepository } from "../../interest/InterestRepository"
import { RatingRepository } from "../../rating/RatingRepository"
import { useGetUserSimilarity } from "./useGetUserSimilarity"

export class useFindSimilarUsers {
  constructor(
    private ratingRepo = new RatingRepository(),
    private interestRepo = new InterestRepository(),
    private getUserSimilarity = new useGetUserSimilarity()
  ) {}

  async exec(requesterId: string) {
    const requesterRatings = await this.ratingRepo.findRatingsByUserId(
      requesterId
    )

    const requesterHighInterests = await this.interestRepo.findHighInterestsByUserId(
      requesterId
    )
    const highInterestImdbIds = requesterHighInterests.map((i) =>
      String(i.imdbItemId)
    )

    const imdbItemIds = requesterRatings
      .filter((r) => typeof r.imdbItemId !== null)
      .map((r) => String(r.imdbItemId))

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

        return this.getUserSimilarity.exec({
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
}
