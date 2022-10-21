import { UserRepository } from "./UserRepository"

export class UserService {
  constructor(private userRepo = new UserRepository()) {}

  async findUserInfo(userId: string) {
    return this.userRepo.findUserInfoByUserId(userId)
  }
}
