import { SyncroItemType } from "../../domains/search/types/SyncroItemType/SyncroItemType"

export const redisKeys = {
  imdbQueryResult: (query: string, itemType: SyncroItemType) =>
    `imdb/${itemType}/${query}`,

  googleSearch: (query: string) => `google/${query}`,
  igdbGameTitles: (titles: string[]) => `igdb/${titles.join(",")}`,
  syncroItem: (itemId: string) => `syncro-item/${itemId}`,
}
