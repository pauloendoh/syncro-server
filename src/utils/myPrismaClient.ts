import { PrismaClient } from "@prisma/client"

// to minimize connection polls, use only one instance of prisma
const myPrismaClient = new PrismaClient()

export default myPrismaClient
