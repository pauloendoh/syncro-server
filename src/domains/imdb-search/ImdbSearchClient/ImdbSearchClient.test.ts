import MockAdapter from "axios-mock-adapter"
import Redis from "ioredis"
import { anything, instance, mock, when } from "ts-mockito"
import { describe, expect, test } from "vitest"
import { urls } from "../../../utils/urls"
import igdbAxios from "../../igdb-search/utils/igdbAxios"
import { ImdbSearchClient } from "./ImdbSearchClient"

describe("ImdbSearchClient", () => {
  describe("searchCacheImdbItems", () => {
    test("when not cached + and when axios throws 429 error -> should call axios with apiNumber 2", async () => {
      const mockedRedis = mock(Redis)
      when(mockedRedis.get(anything())).thenResolve(null)

      const mockedAxios = new MockAdapter(igdbAxios)
      mockedAxios
        .onGet(urls.imdbTitles(1))
        .replyOnce(429)
        .onGet(urls.imdbTitles(2))
        .replyOnce(200)

      const sut = new ImdbSearchClient(igdbAxios, instance(mockedRedis))

      await sut.searchCacheImdbItems({
        query: "query",
        itemType: "tvSeries",
      })

      expect(mockedAxios.history.get[1].url).toBe(urls.imdbTitles(2))
    })
  })

  describe("fetchAndCacheImdbItemDetails", () => {
    test("when not cached + and when axios throws 429 error -> should call axios with apiNumber 2", async () => {
      const mockedRedis = mock(Redis)
      when(mockedRedis.get(anything())).thenResolve(null)

      const mockedAxios = new MockAdapter(igdbAxios)
      mockedAxios
        .onGet(urls.imdbTitleDetails(1))
        .replyOnce(429)
        .onGet(urls.imdbTitleDetails(2))
        .replyOnce(200)

      const sut = new ImdbSearchClient(igdbAxios, instance(mockedRedis))

      await sut.fetchAndCacheImdbItemDetails("random idid", 1)

      expect(mockedAxios.history.get[1].url).toBe(urls.imdbTitleDetails(2))
    })
  })
})
