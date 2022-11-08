import myPrismaClient from "../../utils/myPrismaClient"
import { userSelectFields } from "../../utils/prisma/fields/user/userSelectFields"

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
      include: {
        followingUser: {
          select: userSelectFields,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findFollowers(userId: string) {
    return this.prismaClient.follow.findMany({
      where: {
        followingUserId: userId,
      },
      include: {
        follower: {
          select: userSelectFields,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findMostFollowedUsers() {
    return this.prismaClient.follow.groupBy({
      by: ["followingUserId"],
      _count: {
        followingUserId: true,
      },
      orderBy: {
        _count: {
          followingUserId: "desc",
        },
      },
    })
  }
}
