import myPrismaClient from "../../utils/myPrismaClient"

export class AuthRepository {
  constructor(private prismaClient = myPrismaClient) {}

  createUser = async (dto: {
    username: string
    email: string
    password: string
    expiresAt: string
  }) => {
    return this.prismaClient.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: dto.password,
        expiresAt: dto.expiresAt,
      },
    })
  }

  public async findUserByUsernameEmail(usernameOrEmail: string) {
    const user = await this.prismaClient.user.findFirst({
      where: {
        OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      },
    })

    return user
  }
}
