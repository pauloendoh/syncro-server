import myPrismaClient from "../../utils/myPrismaClient";

export class AuthRepository {
  constructor(private prismaClient = myPrismaClient) {}

  public async findUserByUsernameEmail(usernameOrEmail: string) {
    const user = await this.prismaClient.user.findFirst({
      where: {
        OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      },
    });

    return user;
  }
}
