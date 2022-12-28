import { User } from "@prisma/client"
import { Body, CurrentUser, JsonController, Post } from "routing-controllers"
import { DidNotFindService } from "./DidNotFindService"
import { DidNotFindPostDto } from "./types/DidNotFindPostDto"
@JsonController()
export class DidNotFindController {
  constructor(private didNotFindService = new DidNotFindService()) {}

  @Post("/did-not-find")
  async findHomeItems(
    @CurrentUser({ required: true }) user: User,
    @Body() body: DidNotFindPostDto
  ) {
    const query = body.query.trim().toLocaleLowerCase()

    return this.didNotFindService.createDidNotFind({
      query,
      type: body.type,
      userId: user.id,
    })
  }
}
