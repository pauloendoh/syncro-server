import myPrismaClient from "../utils/myPrismaClient"

export const createProfileForUsersWithoutProfile = async () => {
  console.log("[START] Creating profile for users without profile")

  const usersWithoutProfile = await myPrismaClient.user.findMany({
    where: {
      profile: null,
    },
  })

  for (const user of usersWithoutProfile) {
    await myPrismaClient.profile.create({
      data: {
        userId: user.id,
      },
    })
  }

  console.log("[END] Creating profile for users without profile")
}
