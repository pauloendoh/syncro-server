import { User } from "@prisma/client"
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

  findUserByEmail(email: string) {
    return this.prismaClient.user.findFirst({
      where: { email },
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
    return this.prismaClient.syncroItem.findMany({
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

  // PE 1/3 - improve name
  async usersSavedItemId(userIds: string[], itemId: string) {
    return this.prismaClient.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        ...userSelectFields,
        interests: {
          where: {
            syncroItemId: itemId,
          },
        },
        ratings: {
          where: {
            syncroItemId: itemId,
          },
        },
      },
    })
  }

  updateUser(user: User) {
    return this.prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...user,
      },
    })
  }

  findNewUsers() {
    return this.prismaClient.user.findMany({
      select: userSelectFields,
      orderBy: {
        createdAt: "desc",
      },
    })
  }
}
