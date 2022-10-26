import { FollowRepository } from "../follow/FollowRepository"
import { RatingRepository } from "../rating/RatingRepository"
import { FeedRepository } from "./FeedRepository"

export class FeedService {
  constructor(
    private feedRepo = new FeedRepository(),
    private followRepo = new FollowRepository(),
    private ratingRepo = new RatingRepository()
  ) {}

  findHomeItems = async (requesterId: string) => {
    const follows = await this.followRepo.findFollowingUsers(requesterId)

    const userIds = follows.map((f) => f.followingUserId)

    return this.feedRepo.findHomeRatingsByUsersIds(userIds)
  }
}
