import { User } from "@prisma/client"

export const buildUser = (p?: Partial<User>): User => ({
  id: "",
  username: "",
  email: "",
  password: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  expiresAt: null,
  ...p,
})
