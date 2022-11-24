import { User } from "@prisma/client"
import {
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Put,
  QueryParam,
} from "routing-controllers"
import ProfileService from "../profile/ProfileService"
import { ProfilePutDto } from "../profile/types/ProfilePutDto"
import { useFindMutualsSavedItem } from "../user-similarity/useCases/useFindMutualsSavedItem"
import { useFindSimilarUsers } from "../user-similarity/useCases/useFindSimilarUsers"
import { UseLogoutPushToken } from "./useCases/UseLogoutPushToken"

@JsonController()
export class UserController {
  constructor(
    private findSimilarUsers = new useFindSimilarUsers(),
    private profileService = new ProfileService(),
    private findMutualsSavedItem = new useFindMutualsSavedItem(),
    private _logoutPushToken = new UseLogoutPushToken()
  ) {}

  @Get("/me/similar-users")
  async findMySimilarUsers(@CurrentUser({ required: true }) user: User) {
    return this.findSimilarUsers.exec(user.id)
  }

  @Put("/me/profile")
  async updateMyProfile(
    @CurrentUser({ required: true }) user: User,
    @Body() body: ProfilePutDto
  ) {
    return this.profileService.updateProfile(user.id, body)
  }

  @Get("/me/mutuals/saved-item")
  async findIfMutualsSavedItem(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("itemId", { required: true }) itemId: string
  ) {
    return this.findMutualsSavedItem.exec({ requesterId: user.id, itemId })
  }

  @Delete("/me/push-token/:pushToken")
  async logoutPushToken(
    @CurrentUser({ required: true }) user: User,
    @Param("pushToken") pushToken: string
  ) {
    return this._logoutPushToken.exec({ requesterId: user.id, pushToken })
  }
}
