import { User } from "@prisma/client"
import {
  BadRequestError,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
} from "routing-controllers"
import { AuthService } from "./AuthService"
import { LoginDto } from "./types/LoginDto"
import { RegisterDto } from "./types/RegisterDto"

@JsonController("/auth")
export class AuthController {
  constructor(private authService = new AuthService()) {}

  @Post("/register")
  async register(@Body() dto: RegisterDto) {
    if (dto.password1 !== dto.password2)
      throw new BadRequestError("Passwords don't match")

    return this.authService.register(dto)
  }

  @Post("/login")
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Get("/me")
  async getMe(@CurrentUser() user: User) {
    return this.authService.getAuthUserWithToken(user)
  }

  @Get("/temp-user")
  async getTempUser() {
    return this.authService.getTempUser()
  }
}
