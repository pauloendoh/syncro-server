export interface ImdbItemDetailsResponse {
  id: string
  title: Title
  certificates: Certificates
  ratings: Ratings
  genres: string[]
  releaseDate: string
  plotOutline: PlotOutline
  plotSummary: PlotSummary
}

interface PlotSummary {
  author: string
  id: string
  text: string
}

interface PlotOutline {
  id: string
  text: string
}

interface Ratings {
  canRate: boolean
  rating: number
  ratingCount: number
  otherRanks: OtherRank[]
}

interface OtherRank {
  id: string
  label: string
  rank: number
  rankType: string
}

interface Certificates {
  US: ME[]
}

interface ME {
  certificate: string
  country: string
}

interface Title {
  "@type": string
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
}

interface Image {
  height: number
  id: string
  url: string
  width: number
}
