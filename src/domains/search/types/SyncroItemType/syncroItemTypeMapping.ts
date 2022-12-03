import { SyncroItemType as DbSyncroItemType } from "@prisma/client"
import { SyncroItemType } from "./SyncroItemType"

export const syncroItemTypeMapping: {
  [key in SyncroItemType]: {
    dbSyncroItemType: DbSyncroItemType
  }
} = {
  movie: {
    dbSyncroItemType: "movie",
  },
  "tv series": {
    dbSyncroItemType: "tvSeries",
  },
  game: {
    dbSyncroItemType: "game",
  },
}
