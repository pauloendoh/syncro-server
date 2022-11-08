import { BadRequestError } from "routing-controllers"
import { isValidSite } from "../../utils/text/isValidSite"
import { urls } from "../../utils/urls"
import { UserRepository } from "../user/UserRepository"
import { ProfileRepository } from "./ProfileRepository"
import { AwsFileDto } from "./types/AwsFileDto"
import { MulterFileDto } from "./types/MulterFileDto"
import { ProfilePutDto } from "./types/ProfilePutDto"

export default class ProfileService {
  constructor(
    private readonly profileRepo = new ProfileRepository(),
    private userRepo = new UserRepository()
  ) {}

  updatePicture = async (userId: string, file: MulterFileDto | AwsFileDto) => {
    let imgUrl = ""

    if ("Location" in file) imgUrl = file.Location
    else if ("filename" in file) imgUrl = urls.publicUploads(file.filename)

    return this.profileRepo.updatePicture(userId, imgUrl)
  }

  updateProfile = async (requesterId: string, profile: ProfilePutDto) => {
    profile.website = profile.website.trim()
    profile.username = profile.username.trim()

    if (profile.website.length > 0 && !isValidSite(profile.website))
      throw new BadRequestError("Website is not valid.")

    const authUser = await this.userRepo.findUserById(requesterId)

    if (authUser?.username !== profile.username) {
      const usernameAlreadyExists = await this.userRepo.findUserByUsername(
        profile.username
      )

      if (usernameAlreadyExists)
        throw new BadRequestError("Username already in use.")

      await this.userRepo.updateUsername(profile.username, requesterId)
    }

    return this.profileRepo.updateProfile(requesterId, profile)
  }
}
