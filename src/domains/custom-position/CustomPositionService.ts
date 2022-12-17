import { CustomPosition, SyncroItemType } from "@prisma/client"
import { NotFoundError } from "routing-controllers"
import { SyncroItemRepository } from "../syncro-item/SyncroItemRepository"
import { CustomPositionRepository } from "./CustomPositionRepository"

export class CustomPositionService {
  constructor(
    private itemRepo = new SyncroItemRepository(),
    private customPositionRepo = new CustomPositionRepository()
  ) {}

  async checkOrCreateAtLastPosition(itemId: string, requesterId: string) {
    const syncroItem = await this.itemRepo.findSyncroItemById(itemId)

    if (!syncroItem) throw new NotFoundError("Item not found.")

    const alreadyExists = await this.customPositionRepo.findCustomPositionByItemId(
      syncroItem.id,
      requesterId
    )
    if (alreadyExists) return alreadyExists

    const nextPosition = await this.customPositionRepo.findNextAvailablePosition(
      requesterId,
      syncroItem.type
    )

    return await this.customPositionRepo.createCustomPosition(
      itemId,
      requesterId,
      nextPosition
    )
  }

  async findCustomPositionsByItemType(
    requesterId: string,
    itemType: SyncroItemType
  ) {
    return this.customPositionRepo.findCustomPositionsByItemType(
      requesterId,
      itemType
    )
  }

  async updateCustomPosition(sent: CustomPosition, requesterId: string) {
    let savedCustomPosition = await this.customPositionRepo.findCustomPositionById(
      sent.id
    )

    if (!savedCustomPosition)
      savedCustomPosition = await this.checkOrCreateAtLastPosition(
        sent.syncroItemId!,
        requesterId
      )

    if (savedCustomPosition.userId !== requesterId)
      throw new NotFoundError("Not found or not allowed.")

    const type = await this.customPositionRepo.findCustomPositionImdbItemTypeById(
      savedCustomPosition.id
    )
    if (!type) throw new NotFoundError("Type not found.")

    const allCustomPositions = await this.customPositionRepo.findCustomPositionsByItemType(
      requesterId,
      type
    )

    // it's already sorted by position desc
    const otherCustomPositions = allCustomPositions.filter(
      (p) => p.id !== savedCustomPosition?.id
    )

    const newCustomPosition: CustomPosition = {
      ...savedCustomPosition,
      position: sent.position,
    }
    const index = sent.position - 1

    otherCustomPositions.splice(index, 0, newCustomPosition)

    const newCustomPositions: CustomPosition[] = otherCustomPositions.map(
      (p, i) => ({
        ...p,
        position: i + 1,
      })
    )

    return this.customPositionRepo.saveManyCustomPositions(newCustomPositions)
  }

  async checkAndHandleDelete(itemId: string, requesterId: string) {
    const stillExists = await this.customPositionRepo.checkIfRatingOrInterestExist(
      itemId,
      requesterId
    )

    if (!stillExists)
      this.customPositionRepo.deleteCustomPositionByItemId(itemId, requesterId)
  }
}
