import { FollowRepository } from "./FollowRepository"

export class FollowService {
  constructor(private followRepo = new FollowRepository()) {}

  async toggleFollow(requesterId: string, followingUserId: string) {
    const alreadyFollowing = await this.followRepo.userAIsFollowingUserB(
      requesterId,
      followingUserId
    )

    if (!alreadyFollowing)
      return this.followRepo.followUser(requesterId, followingUserId)

    await this.followRepo.unfollow(alreadyFollowing.id)

    return "deleted"
  }

  async findFollowingUsers(followerId: string) {
    return this.followRepo.findFollowingUsers(followerId)
  }
}
