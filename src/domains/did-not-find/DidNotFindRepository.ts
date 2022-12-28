import myPrismaClient from "../../utils/myPrismaClient"

export class DidNotFindRepository {
  constructor(private prisma = myPrismaClient) {}

  async createDidNotFind(params: {
    userId: string
    query: string
    type: string
  }) {
    return this.prisma.didNotFind.create({
      data: {
        userId: params.userId,
        query: params.query,
        type: params.type,
      },
    })
  }

  async alreadyExists(params: { userId: string; query: string; type: string }) {
    return this.prisma.didNotFind.findFirst({
      where: {
        userId: params.userId,
        query: params.query,
        type: params.type,
      },
    })
  }
}
