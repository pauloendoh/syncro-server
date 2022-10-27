import { ImdbItem, Interest, Rating } from "@prisma/client"

export interface Meta {
  operation: string
  requestId: string
  serviceTimeMs: number
}

export interface Image {
  height: number
  id: string
  url: string
  width: number
}

export interface Role {
  character: string
  characterId: string
}

export interface Principal {
  id: string
  legacyNameText: string
  name: string
  category: string
  characters: string[]
  endYear: number
  episodeCount: number
  roles: Role[]
  startYear: number
  disambiguation: string
  attr: string[]
  as: string
  billing?: number
}

export interface Image2 {
  height: number
  id: string
  url: string
  width: number
}

export interface ParentTitle {
  id: string
  image: Image2
  title: string
  titleType: string
  year: number
}

export interface Crew {
  category: string
  job: string
}

export interface Summary {
  category: string
  displayYear: string
}

export interface KnownFor {
  crew: Crew[]
  summary: Summary
  id: string
  title: string
  titleType: string
  year: number
}

export interface Result {
  id: string
  image: Image
  runningTimeInMinutes: number
  nextEpisode: string
  numberOfEpisodes: number
  seriesEndYear: number
  seriesStartYear: number
  title: string
  titleType: string
  year: number
  principals: Principal[]
  episode?: number
  season?: number
  parentTitle: ParentTitle
  previousEpisode: string
  legacyNameText: string
  name: string
  knownFor: KnownFor[]
  myRating?: Rating
  myInterest?: Interest
  imdbItem?: ImdbItem
}

export interface ImdbResultResponseDto {
  "@meta": Meta
  "@type": string
  query: string
  results: Result[]
  types: string[]
}
