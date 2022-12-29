import { transformAndValidateSync } from "class-transformer-validator"
import { IsString, MinLength } from "class-validator"

export class LoginDto {
  @IsString({ message: "Identificator is required." })
  @MinLength(6, { message: "Identificator must have at least 6 characters." })
  identificator: string

  @IsString({ message: "Password is required." })
  @MinLength(6, { message: "Password must have at least 6 characters." })
  password: string
}

export const buildLoginDto = (p?: Partial<LoginDto>): LoginDto =>
  transformAndValidateSync(LoginDto, {
    identificator: "test12",
    password: "test12",
    ...p,
  })
