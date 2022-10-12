import { Rating, User } from "@prisma/client"
import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
} from "routing-controllers"
import { RatingService } from "./RatingService"

@JsonController()
export class RatingController {
  constructor(private ratingService = new RatingService()) {}

  @Get("/me/ratings")
  async findMyRatings(@CurrentUser({ required: true }) user: User) {
    return this.ratingService.findRatingsByUserId(user.id)
  }

  @Post("/me/ratings")
  async saveRating(
    @CurrentUser({ required: true }) user: User,
    @Body() body: Rating
  ) {
    return this.ratingService.saveRating(body, user.id)
  }
}
