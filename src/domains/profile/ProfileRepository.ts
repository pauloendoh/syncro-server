import myPrismaClient from "../../utils/myPrismaClient"
import { ProfilePutDto } from "./types/ProfilePutDto"

export class ProfileRepository {
  constructor(private profilePrisma = myPrismaClient.profile) {}

  findProfileByUserId(userId: string) {
    return this.profilePrisma.findFirst({
      where: {
        userId,
      },
    })
  }

  async updatePicture(userId: string, pictureUrl: string) {
    return this.profilePrisma.upsert({
      create: {
        pictureUrl,
        bio: "",
        userId,
      },
      update: {
        pictureUrl,
      },
      where: {
        userId,
      },
    })
  }

  async updateProfile(userId: string, profile: ProfilePutDto) {
    return this.profilePrisma.update({
      data: {
        fullName: profile.name,
        websiteUrl: profile.website,
        bio: profile.bio,
      },
      where: {
        userId,
      },
    })
  }
}
