import { User } from "@prisma/client"
import {
  BadRequestError,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
  QueryParam,
} from "routing-controllers"
import { EmailService } from "../email/EmailService"
import { AuthService } from "./AuthService"
import { LoginDto } from "./types/LoginDto"
import { PasswordResetPostDto } from "./types/PasswordResetPostDto"
import { RegisterDto } from "./types/RegisterDto"

@JsonController("/auth")
export class AuthController {
  constructor(
    private authService = new AuthService(),
    private emailService = new EmailService()
  ) {}

  @Post("/register")
  async register(@Body() dto: RegisterDto) {
    if (dto.password1 !== dto.password2)
      throw new BadRequestError("Passwords don't match")

    return this.authService.register(dto)
  }

  @Post("/login")
  async login(
    @Body() dto: LoginDto,
    @QueryParam("pushToken") pushToken: string
  ) {
    return this.authService.login(dto, pushToken)
  }

  @Get("/me")
  async getMe(@CurrentUser() user: User) {
    return this.authService.getAuthUserWithToken(user)
  }

  @Get("/temp-user")
  async getTempUser() {
    return this.authService.getTempUser()
  }

  @Post("/password-reset-email")
  sendPasswordResetEmail(@Body({ required: true }) body: { email: string }) {
    return this.emailService.sendPasswordResetEmail(body.email)
  }

  @Post("/confirm-password-reset-code")
  confirmPasswordResetCode(
    @Body({ required: true }) body: { email: string; code: string }
  ) {
    return this.authService.confirmPasswordResetCode(body.email, body.code)
  }

  @Post("/end-password-reset")
  endResetPassword(@Body({ required: true }) body: PasswordResetPostDto) {
    return this.authService.endResetPassword(body)
  }
}
