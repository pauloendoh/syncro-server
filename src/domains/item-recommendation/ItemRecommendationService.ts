import { SyncroItemType as MySyncroItemType } from "../search/types/SyncroItemType/SyncroItemType"
import { syncroItemTypeMapping } from "../search/types/SyncroItemType/syncroItemTypeMapping"
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
    itemType: MySyncroItemType
  }) {
    const { requesterId, userId, itemType } = params

    const dbSyncroItemType = syncroItemTypeMapping[itemType].dbSyncroItemType

    const allMyRatedItems = await this.itemRepo.findItemsRatedByUserDesc(
      requesterId
    )
    const myRatedItems = allMyRatedItems.filter(
      (item) => item.type === dbSyncroItemType
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
