import myPrismaClient from "../../utils/myPrismaClient"
import { userSelectFields } from "../../utils/prisma/fields/user/userSelectFields"

export class UserRepository {
  constructor(private prismaClient = myPrismaClient) {}

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

  findUserInfoByUserId(userId: string) {
    return this.prismaClient.user.findFirst({
      where: {
        id: userId,
      },
      select: userSelectFields,
    })
  }
}
