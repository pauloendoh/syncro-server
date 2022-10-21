import { Rating } from "@prisma/client"
import { ForbiddenError } from "routing-controllers"
import { RatingRepository } from "./RatingRepository"

export class RatingService {
  constructor(private ratingRepo = new RatingRepository()) {}

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
    return this.ratingRepo.createRating(rating)
  }

  async updateRating(rating: Rating, requesterId: string) {
    const isAllowed = await this.ratingRepo.userOwnsRating(
      requesterId,
      rating.id
    )
    if (!isAllowed) throw new ForbiddenError("User cannot update this rating.")

    if (rating.ratingValue === null) {
      await this.ratingRepo.deleteRating(rating.id)
      return null
    }

    rating.userId = requesterId

    return this.ratingRepo.updateRating(rating)
  }
}
