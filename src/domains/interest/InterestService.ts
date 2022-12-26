import { Interest, SyncroItemType } from "@prisma/client"
import { ForbiddenError, NotFoundError } from "routing-controllers"
import { CustomPositionService } from "../custom-position/CustomPositionService"
import { SyncroItemRepository } from "../syncro-item/SyncroItemRepository"
import { InterestRepository } from "./InterestRepository"
import { UpdateSavedPositionDto } from "./types/UpdateSavedPositionDto"

export class InterestService {
  constructor(
    private interestRepo = new InterestRepository(),
    private customPositionService = new CustomPositionService(),
    private itemRepo = new SyncroItemRepository()
  ) {}

  async findInterestsByUserId(userId: string) {
    return this.interestRepo.findInterestsByUserId(userId)
  }

  async saveInterest(interest: Interest, requesterId: string) {
    if (interest.id) return this.updateInterest(interest, requesterId)

    return this.createInterest(interest, requesterId)
  }

  async toggleSaveItem(itemId: string, requesterId: string) {
    const interests = await this.interestRepo.findInterestsByUserId(requesterId)

    const found = interests.find((i) => i.syncroItemId === itemId)

    if (found) {
      return this.removeSavedItem(found, requesterId)
    }

    return this.handleSaveItem(itemId, requesterId)
  }

  async removeSavedItem(interest: Interest, requesterId: string) {
    const item = await this.itemRepo.findSyncroItemById(interest.syncroItemId!)

    if (!item) throw new NotFoundError("Item not found.")

    await this.interestRepo.deleteInterest(interest.id)

    const savedItems = await this.interestRepo.findSavedItemsByType(
      requesterId,
      item.type
    )

    const normalizedItems = savedItems.map((i, index) => ({
      ...i,
      position: index + 1,
    }))
    await this.interestRepo.updateMany(normalizedItems)

    return "deleted"
  }

  async handleSaveItem(itemId: string, requesterId: string) {
    const item = await this.itemRepo.findSyncroItemById(itemId)

    if (!item) throw new NotFoundError("Item not found.")

    const savedItems = await this.interestRepo.findSavedItemsByType(
      requesterId,
      item.type
    )

    const lastPosition = savedItems.length
    const nextPosition = lastPosition + 1

    return this.interestRepo.saveItem({
      itemId,
      requesterId,
      position: nextPosition,
    })
  }

  async createInterest(interest: Interest, requesterId: string) {
    if (interest.interestLevel === null && interest.interestLevel === null)
      return null

    interest.userId = requesterId
    const createdInterest = await this.interestRepo.createInterest(interest)

    if (interest.syncroItemId)
      this.customPositionService.checkOrCreateAtLastPosition(
        interest.syncroItemId,
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

      if (interest.syncroItemId)
        await this.customPositionService.checkAndHandleDelete(
          interest.syncroItemId,
          requesterId
        )

      return null
    }

    interest.userId = requesterId

    return this.interestRepo.updateInterest(interest)
  }

  async findSavedItems(userId: string) {
    return this.interestRepo.findSavedItems(userId)
  }

  async findSavedItemsByType(userId: string, type: SyncroItemType) {
    return this.interestRepo.findSavedItemsByType(userId, type)
  }

  async updateSavedPosition(
    payload: UpdateSavedPositionDto,
    requesterId: string
  ) {
    const found = await this.interestRepo.findByIdAndUserId(
      payload.interestId,
      requesterId
    )

    if (!found) throw new NotFoundError("Interest not found.")

    const savedItems = await this.interestRepo.findSavedItemsByType(
      requesterId,
      found.syncroItem!.type
    )

    const prevIndex = savedItems.findIndex((i) => i.id === payload.interestId)
    const targetIndex = payload.newPosition - 1

    const saved = { ...savedItems[prevIndex] }

    savedItems.splice(prevIndex, 1)
    savedItems.splice(targetIndex, 0, saved)

    const newItems = savedItems.map((i, index) => ({
      ...i,
      position: index + 1,
    }))
    await this.interestRepo.updateMany(newItems)
    return true
  }
}
