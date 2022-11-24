import { DateTime } from "luxon"
import myPrismaClient from "../../utils/myPrismaClient"
import { generateSixNumbers } from "../../utils/text/generateSixNumbers"

export class UserTokenRepository {
  constructor(private prismaClient = myPrismaClient) {}

  deleteAllPasswordResetTokens(userId: string) {
    return this.prismaClient.userToken.deleteMany({
      where: {
        userId,
        type: "PASSWORD_RESET_CODE",
      },
    })
  }

  createPasswordResetToken(userId: string) {
    return this.prismaClient.userToken.create({
      data: {
        userId,
        type: "PASSWORD_RESET_CODE",
        token: generateSixNumbers(),
        expiresAt: DateTime.now().plus({ minutes: 15 }).toISO(),
      },
    })
  }

  passwordResetCodeExists(userId: string, code: string) {
    return this.prismaClient.userToken.findFirst({
      where: {
        userId: userId,
        token: code,
        type: "PASSWORD_RESET_CODE",
        expiresAt: {
          gt: new Date().toISOString(),
        },
      },
    })
  }

  createPushToken(userId: string, pushToken: string) {
    return this.prismaClient.userToken.create({
      data: {
        userId,
        token: pushToken,
        type: "PUSH_TOKEN",
      },
    })
  }

  deletePushToken(userId: string, pushToken: string) {
    return this.prismaClient.userToken.deleteMany({
      where: {
        userId,
        type: "PUSH_TOKEN",
        token: pushToken,
      },
    })
  }
}
