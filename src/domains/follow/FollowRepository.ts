import myPrismaClient from "../../utils/myPrismaClient"

export class FollowRepository {
  constructor(private prismaClient = myPrismaClient) {}

  userAIsFollowingUserB(userAId: string, userBId: string) {
    return this.prismaClient.follow.findFirst({
      where: {
        followerId: userAId,
        followingUserId: userBId,
      },
    })
  }

  followUser(followerId: string, followingUserId: string) {
    return this.prismaClient.follow.create({
      data: {
        followerId,
        followingUserId,
      },
    })
  }

  unfollow(followId: string) {
    return this.prismaClient.follow.delete({
      where: {
        id: followId,
      },
    })
  }

  async findFollowingUsers(followerId: string) {
    return this.prismaClient.follow.findMany({
      where: {
        followerId,
      },
    })
  }
}
