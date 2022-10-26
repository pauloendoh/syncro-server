import myPrismaClient from "../../utils/myPrismaClient"

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
}
