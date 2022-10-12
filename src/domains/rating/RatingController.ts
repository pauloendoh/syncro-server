import { Rating, User } from "@prisma/client"
import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
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

  @Get("/user/:id/ratings")
  async userRatings(
    @CurrentUser({ required: true }) user: User,
    @Param("id") id: string
  ) {
    return this.ratingService.findRatingsByUserId(id)
  }

  @Post("/me/ratings")
  async saveRating(
    @CurrentUser({ required: true }) user: User,
    @Body() body: Rating
  ) {
    return this.ratingService.saveRating(body, user.id)
  }
}
