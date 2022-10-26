import { User } from "@prisma/client"
import { compare, genSalt, hash } from "bcrypt"
import { config } from "dotenv"
import { sign } from "jsonwebtoken"
import { BadRequestError, NotFoundError } from "routing-controllers"
import myPrismaClient from "../../utils/myPrismaClient"
import { AuthRepository } from "./AuthRepository"
import { AuthUserGetDto } from "./types/AuthUserGetDto"
import { LoginDto } from "./types/LoginDto"
import { RegisterDto } from "./types/RegisterDto"

config()

export class AuthService {
  constructor(private authRepo = new AuthRepository()) {}

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

    // Checking if username is valid
    const regex = new RegExp(/^[a-zA-Z0-9]+$/)
    if (!regex.test(dto.username)) {
      throw new BadRequestError(
        "Invalid characters for username. Only use letters and numbers."
      )
    }

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
    return new AuthUserGetDto(createdUser, token, expiresAt)
  }

  public async login(payload: LoginDto) {
    const user = await this.authRepo.findUserByUsernameEmail(
      (payload.identificator = payload.identificator.trim())
    )
    if (!user) throw new NotFoundError("User not found")

    const passwordOk = await compare(payload.password, user.password)
    if (!passwordOk) throw new BadRequestError("Password not correct")

    const { token, expiresAt } = this.getSignInToken(user)
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
}
