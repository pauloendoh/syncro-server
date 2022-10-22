import { User } from "@prisma/client"
import { CurrentUser, Get, JsonController } from "routing-controllers"
import { UserSimilarityService } from "../user-similarity/UserSimilarityService"

@JsonController()
export class UserController {
  constructor(private userSimilarityService = new UserSimilarityService()) {}

  @Get("/me/similar-users")
  async findMySimilarUsers(@CurrentUser({ required: true }) user: User) {
    return this.userSimilarityService.findSimilarUsers(user.id)
  }
}
