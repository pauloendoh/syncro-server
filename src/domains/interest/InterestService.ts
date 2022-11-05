import { Interest } from "@prisma/client"
import { ForbiddenError } from "routing-controllers"
import { CustomPositionService } from "../custom-position/CustomPositionService"
import { InterestRepository } from "./InterestRepository"

export class InterestService {
  constructor(
    private interestRepo = new InterestRepository(),
    private customPositionService = new CustomPositionService()
  ) {}

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
    const createdInterest = await this.interestRepo.createInterest(interest)

    if (interest.imdbItemId)
      this.customPositionService.checkOrCreateAtLastPosition(
        interest.imdbItemId,
        requesterId
      )

    return createdInterest
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

      if (interest.imdbItemId)
        await this.customPositionService.checkAndHandleDelete(
          interest.imdbItemId,
          requesterId
        )

      return null
    }

    interest.userId = requesterId

    return this.interestRepo.updateInterest(interest)
  }
}
