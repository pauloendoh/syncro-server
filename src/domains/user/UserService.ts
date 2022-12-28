import { UserRepository } from "./UserRepository"

export class UserService {
  constructor(private userRepo = new UserRepository()) {}

  async findUserInfo(userId: string) {
    return this.userRepo.findUserInfoByUserId(userId)
  }

  async findUserItems(userId: string, requesterId: string) {
    const [userItems, requesterItems] = await Promise.all([
      this.userRepo.findUserItems(userId),
      this.userRepo.findUserItems(requesterId),
    ])
    return userItems.map((userItem) => ({
      ...userItem,
      myInterest:
        requesterItems.find((requesterItem) => requesterItem.id === userItem.id)
          ?.interests?.[0]?.interestLevel || null,
      myRating:
        requesterItems.find((requesterItem) => requesterItem.id === userItem.id)
          ?.ratings?.[0]?.ratingValue || null,
    }))
  }

  async findNewUsers() {
    return this.userRepo.findNewUsers()
  }
}
