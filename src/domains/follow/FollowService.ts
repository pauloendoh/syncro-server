import { UserRepository } from "../user/UserRepository"
import { FollowRepository } from "./FollowRepository"

export class FollowService {
  constructor(
    private followRepo = new FollowRepository(),
    private userRepo = new UserRepository()
  ) {}

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

  async findFollowers(userId: string) {
    return this.followRepo.findFollowers(userId)
  }

  async findMostFollowedUsers() {
    const groupBy = await this.followRepo.findMostFollowedUsers()
    const userIds = groupBy.map((g) => g.followingUserId)

    return this.userRepo.findByUserIds(userIds)
  }
}
