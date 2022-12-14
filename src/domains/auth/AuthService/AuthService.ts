import { User } from "@prisma/client"
import { compare, genSalt, hash } from "bcrypt"
import cuid from "cuid"
import { config } from "dotenv"
import { sign } from "jsonwebtoken"
import { BadRequestError, NotFoundError } from "routing-controllers"
import myPrismaClient from "../../../utils/myPrismaClient"
import { validateUsernameOrThrow } from "../../../utils/text/isValidUsername/validateUsernameOrThrow"
import { EmailService } from "../../email/EmailService"
import { UserTokenRepository } from "../../user-token/UserTokenRepository"
import { UserRepository } from "../../user/UserRepository"
import { AuthRepository } from "../AuthRepository"
import { AuthUserGetDto } from "../types/AuthUserGetDto"
import { LoginDto } from "../types/LoginDto"
import { PasswordResetPostDto } from "../types/PasswordResetPostDto"
import { RegisterDto } from "../types/RegisterDto"

config()

export class AuthService {
  constructor(
    private authRepo = new AuthRepository(),
    private userRepo = new UserRepository(),
    private tokenRepo = new UserTokenRepository(),
    private emailService = new EmailService()
  ) {}

  async register(dto: RegisterDto) {
    dto.username = dto.username.trim()
    dto.email = dto.email.trim()

    const emailExists = await myPrismaClient.user.findFirst({
      where: { email: dto.email },
    })
    if (emailExists) throw new BadRequestError("Email already in use.")

    const usernameExists = await myPrismaClient.user.findFirst({
      where: { username: dto.username },
    })
    if (usernameExists) throw new BadRequestError("Username already in use.")

    validateUsernameOrThrow(dto.username)

    const salt = await genSalt(10)
    const hashedPassword = await hash(dto.password1, salt)

    const createdUser = await myPrismaClient.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        username: dto.username,
      },
    })

    await myPrismaClient.profile.create({
      data: {
        userId: createdUser.id,
      },
    })

    const { token, expiresAt } = this.getSignInToken(createdUser)
    this.emailService.notifyNewUserToDevs(createdUser.username)

    return new AuthUserGetDto(createdUser, token, expiresAt)
  }

  public async login(payload: LoginDto, pushToken: string | null) {
    const user = await this.authRepo.findUserByUsernameEmail(
      (payload.identificator = payload.identificator.trim())
    )
    if (!user) throw new NotFoundError("User not found")

    const passwordOk = await compare(payload.password, user.password)
    if (!passwordOk) throw new BadRequestError("Password not correct")

    const { token, expiresAt } = this.getSignInToken(user)

    if (pushToken && pushToken !== "null") {
      await this.tokenRepo.deletePushToken(pushToken)
      // don't remove this await
      await this.tokenRepo.createPushToken(user.id, pushToken)
    }

    return new AuthUserGetDto(user, token, expiresAt)
  }

  public async getAuthUserWithToken(user: User) {
    const { token, expiresAt } = this.getSignInToken(user)
    return new AuthUserGetDto(user, token, expiresAt)
  }

  private getSignInToken(user: User) {
    const expiresAt = new Date(new Date().setDate(new Date().getDate() + 365))
    const ONE_YEAR_IN_SECONDS = 3600 * 24 * 365

    const token = sign({ userId: user.id }, String(process.env.JWT_SECRET), {
      expiresIn: ONE_YEAR_IN_SECONDS,
    })
    return { token, expiresAt }
  }

  getTempUser = async () => {
    const username = cuid()
    const expireDate = new Date(new Date().setDate(new Date().getDate() + 1))

    const user = await this.authRepo.createUser({
      username: username,
      email: username + "@" + username + ".com",
      password: username,
      expiresAt: expireDate.toISOString(),
    })

    // Signing in and returning  user's token
    const ONE_MONTH_IN_SECONDS = 3600 * 24 * 30

    const authUser = await new Promise<AuthUserGetDto>((res, rej) => {
      sign(
        { userId: user.id },
        String(process.env.JWT_SECRET),
        { expiresIn: ONE_MONTH_IN_SECONDS },
        async (err, token) => {
          if (err) return rej(err)

          await myPrismaClient.profile.create({
            data: {
              userId: user.id,
            },
          })

          return res(new AuthUserGetDto(user, String(token), expireDate))
        }
      )
    })

    this.emailService.notifyNewUserToDevs(authUser.username)

    return authUser
  }

  async confirmPasswordResetCode(email: string, code: string) {
    email = email.trim()
    code = code.trim()

    const user = await this.userRepo.findUserByEmail(email)
    if (!user) throw new NotFoundError("User not found.")

    const token = await this.tokenRepo.passwordResetCodeExists(user.id, code)
    if (!token) throw new NotFoundError("Invalid code!")

    return true
  }

  public async endResetPassword(dto: PasswordResetPostDto) {
    dto.email = dto.email.trim()
    dto.code = dto.code.trim()

    // Token exists?
    const tokenExists = await this.confirmPasswordResetCode(dto.email, dto.code)

    if (!tokenExists)
      throw new NotFoundError("Token does not exist or it is expired")

    // se existe, faz a altera????o de senha
    if (tokenExists) {
      const user = await this.userRepo.findUserByEmail(dto.email)
      if (!user) throw new NotFoundError("User not found!")

      const salt = await genSalt(10)
      user.password = await hash(dto.password, salt)

      await this.userRepo.updateUser(user)
      await this.tokenRepo.deleteAllPasswordResetTokens(user.id)

      return true
    }
  }
}
