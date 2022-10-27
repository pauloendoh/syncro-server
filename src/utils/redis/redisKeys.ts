import { SyncroItemType } from "../../domains/search/types/SyncroItemType"

export const redisKeys = {
  imdbQueryResult: (query: string, itemType: SyncroItemType) =>
    `imdb/${itemType}/${query}`,
}
