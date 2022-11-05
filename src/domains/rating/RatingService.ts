import { Rating } from "@prisma/client"
import { ForbiddenError } from "routing-controllers"
import { CustomPositionService } from "../custom-position/CustomPositionService"
import { RatingRepository } from "./RatingRepository"

export class RatingService {
  constructor(
    private ratingRepo = new RatingRepository(),
    private customPositionService = new CustomPositionService()
  ) {}

  async findRatingsByUserId(userId: string) {
    return this.ratingRepo.findRatingsByUserId(userId)
  }

  async saveRating(rating: Rating, requesterId: string) {
    if (rating.id) return this.updateRating(rating, requesterId)

    return this.createRating(rating, requesterId)
  }

  async createRating(rating: Rating, requesterId: string) {
    if (rating.ratingValue === null) return null

    rating.userId = requesterId
    const createdRating = await this.ratingRepo.createRating(rating)

    if (rating.imdbItemId)
      this.customPositionService.checkOrCreateAtLastPosition(
        rating.imdbItemId,
        requesterId
      )

    return createdRating
  }

  async updateRating(rating: Rating, requesterId: string) {
    const isAllowed = await this.ratingRepo.userOwnsRating(
      requesterId,
      rating.id
    )
    if (!isAllowed) throw new ForbiddenError("User cannot update this rating.")

    if (rating.ratingValue === null) {
      await this.ratingRepo.deleteRating(rating.id)

      if (rating.imdbItemId)
        await this.customPositionService.checkAndHandleDelete(
          rating.imdbItemId,
          requesterId
        )
      return null
    }

    rating.userId = requesterId

    return this.ratingRepo.updateRating(rating)
  }
}
