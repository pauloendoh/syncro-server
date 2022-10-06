import { IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsString({ message: "Identificator is required." })
  @MinLength(6, { message: "Identificator must have at least 6 characters." })
  identificator: string;

  @IsString({ message: "Password is required." })
  @MinLength(6, { message: "Password must have at least 6 characters." })
  password: string;
}
