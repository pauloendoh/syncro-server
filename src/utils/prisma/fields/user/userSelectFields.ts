import { Prisma } from '@prisma/client'

// export const userSelectFields: Prisma.UserSelect = {
export const userSelectFields = {
  id: true,
  username: true,
  email: true,
  profile: true,
} satisfies Prisma.UserSelect
