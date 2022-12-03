import { SyncroItem } from "@prisma/client"
import { DateTime } from "luxon"
import myRedisClient from "../../../utils/redis/myRedisClient"
import { redisKeys } from "../../../utils/redis/redisKeys"
import { IgdbClient } from "../../igdb-search/IgdbClient"
import { SyncroItemRepository } from "../SyncroItemRepository"

type ExecParams = { syncroItem: SyncroItem }

export class UseFindAndSaveGameDetails {
  constructor(
    private itemRepo = new SyncroItemRepository(),
    private igdbClient = new IgdbClient(),
    private redisClient = myRedisClient
  ) {}

  exec = async ({ syncroItem }: ExecParams): Promise<SyncroItem> => {
    const cached = await this.redisClient.get(
      redisKeys.syncroItem(syncroItem.id)
    )
    if (cached) return JSON.parse(cached)

    const igdbResponse = await this.igdbClient.searchGame(syncroItem.title)
    const igdbItem = igdbResponse.data[0]

    syncroItem.year = DateTime.fromSeconds(igdbItem.first_release_date).year
    syncroItem.avgRating = Math.round(igdbItem.rating) / 10
    syncroItem.ratingCount = igdbItem.rating_count
    syncroItem.plotSummary = igdbItem.summary

    const updatedItem = await this.itemRepo.updateSyncroItem(syncroItem)

    await this.redisClient.set(
      redisKeys.syncroItem(syncroItem.id),
      JSON.stringify(updatedItem),
      "EX",
      60 * 60 * 24 * 7
    )

    return updatedItem
  }
}
