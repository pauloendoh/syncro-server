import myPrismaClient from "../../utils/myPrismaClient"
import { userSelectFields } from "../../utils/prisma/fields/user/userSelectFields"

export class UserRepository {
  constructor(private prismaClient = myPrismaClient) {}

  findUserById(userId: string) {
    return this.prismaClient.user.findFirst({
      where: {
        id: userId,
      },
    })
  }

  updateUsername(newUsername: string, userId: string) {
    return this.prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        username: newUsername,
      },
    })
  }

  searchUsersByUsername(query: string) {
    return this.prismaClient.user.findMany({
      select: userSelectFields,
      where: {
        username: {
          contains: query,
          mode: "insensitive",
        },
      },
    })
  }

  findByUserIds(userIds: string[]) {
    return this.prismaClient.$transaction(
      userIds.map((userId) =>
        this.prismaClient.user.findFirst({
          where: {
            id: userId,
          },
          select: userSelectFields,
        })
      )
    )
  }

  findUserInfoByUserId(userId: string) {
    return this.prismaClient.user.findFirst({
      where: {
        id: userId,
      },
      select: userSelectFields,
    })
  }

  findUserItems(userId: string) {
    return this.prismaClient.imdbItem.findMany({
      where: {
        OR: [
          {
            ratings: {
              some: {
                userId,
              },
            },
          },
          {
            interests: {
              some: {
                userId,
              },
            },
          },
        ],
      },

      include: {
        interests: {
          where: {
            userId,
          },
        },
        ratings: {
          where: {
            userId,
          },
        },
      },
    })
  }

  findUserByUsername(username: string) {
    return this.prismaClient.user.findFirst({
      where: {
        username,
      },
    })
  }
}
