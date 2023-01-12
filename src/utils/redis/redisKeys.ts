import { SyncroItemType } from "@prisma/client"

export const redisKeys = {
  imdbQueryResult: (query: string, itemType: SyncroItemType) =>
    `imdb/${itemType}/${query}`,

  imdbItemDetails: (imdbId: string) => `imdb/details/${imdbId}`,

  googleSearch: (query: string) => `google/${query}`,
  igdbGameTitles: (titles: string[]) => `igdb/${titles.join(",")}`,
  syncroItem: (itemId: string) => `syncro-item/${itemId}`,
  igdbGameImages: (igdbGameIds: number[]) =>
    `igdb/images?ids${igdbGameIds.join(",")}`,
}
