import { User } from "@prisma/client"
import { CurrentUser, Get, JsonController } from "routing-controllers"
import { useFindSimilarUsers } from "../user-similarity/useCases/useFindSimilarUsers"

@JsonController()
export class UserController {
  constructor(private findSimilarUsers = new useFindSimilarUsers()) {}

  @Get("/me/similar-users")
  async findMySimilarUsers(@CurrentUser({ required: true }) user: User) {
    return this.findSimilarUsers.exec(user.id)
  }
}
