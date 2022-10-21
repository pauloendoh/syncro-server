import { Interest } from "@prisma/client"
import { ForbiddenError } from "routing-controllers"
import { InterestRepository } from "./InterestRepository"

export class InterestService {
  constructor(private interestRepo = new InterestRepository()) {}

  async findInterestsByUserId(userId: string) {
    return this.interestRepo.findInterestsByUserId(userId)
  }

  async saveInterest(interest: Interest, requesterId: string) {
    if (interest.id) return this.updateInterest(interest, requesterId)

    return this.createInterest(interest, requesterId)
  }

  async createInterest(interest: Interest, requesterId: string) {
    if (interest.interestLevel === null && interest.interestLevel === null)
      return null

    interest.userId = requesterId
    return this.interestRepo.createInterest(interest)
  }

  async updateInterest(interest: Interest, requesterId: string) {
    const isAllowed = await this.interestRepo.userOwnsInterest(
      requesterId,
      interest.id
    )
    if (!isAllowed)
      throw new ForbiddenError("User cannot update this interest.")

    if (interest.interestLevel === null && interest.interestLevel === null) {
      await this.interestRepo.deleteInterest(interest.id)
      return null
    }

    interest.userId = requesterId

    return this.interestRepo.updateInterest(interest)
  }
}
