import { IsEmail, IsString } from "class-validator"

export class PasswordResetPostDto {
  @IsEmail()
  email: string

  @IsString()
  code: string

  @IsString()
  password: string
}
