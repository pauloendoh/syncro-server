import { SyncroItemType } from "@prisma/client"
import { SyncroItemRepository } from "../syncro-item/SyncroItemRepository"
import { ItemRecommendationRepository } from "./ItemRecommendationRepository"

export class ItemRecommendationService {
  constructor(
    private recommendationRepo = new ItemRecommendationRepository(),
    private itemRepo = new SyncroItemRepository()
  ) {}

  async findItemRecommendationsFromUser(requesterId: string) {
    return this.recommendationRepo.findItemRecommendationsFromUser(requesterId)
  }

  async findItemsToRecommendToUser(params: {
    requesterId: string
    userId: string
    itemType: SyncroItemType
  }) {
    const { requesterId, userId, itemType } = params

    const allMyRatedItems = await this.itemRepo.findItemsRatedByUserDesc(
      requesterId
    )
    const myRatedItems = allMyRatedItems.filter(
      (item) => item.type === itemType
    )

    const itemIds = myRatedItems.map((item) => item.id)

    const theirSavedItems = await this.itemRepo.filterItemsThatUserSaved(
      userId,
      itemIds
    )

    return myRatedItems.map((ratedItem) => {
      const { ratings, ...item } = ratedItem
      return {
        item,
        myRating: ratings[0].ratingValue,
        theySaved: theirSavedItems.some(
          (savedItem) => savedItem.id === ratedItem.id
        ),
      }
    })
  }
}
