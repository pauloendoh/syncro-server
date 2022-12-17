export interface GoogleItemDto {
  kind: string
  title: string
  htmlTitle: string
  link: string
  displayLink: string
  snippet: string
  htmlSnippet: string
  cacheId: string
  formattedUrl: string
  htmlFormattedUrl: string
  pagemap: Pagemap
}

interface Pagemap {
  cse_thumbnail: Csethumbnail[]
  metatags: Metatag[]
  cse_image: Cseimage[]
  product?: Product[]
  aggregaterating?: Aggregaterating[]
}

interface Cseimage {
  src: string
}

interface Metatag {
  "application-name": string
  "msapplication-tilecolor": string
  "og:image": string
  "msapplication-square70x70logo": string
  "theme-color": string
  "twitter:card": string
  "twitter:title": string
  "og:title": string
  "msapplication-wide310x150logo": string
  "msapplication-tileimage": string
  "csrf-param": string
  "msapplication-square150x150logo": string
  "og:description": string
  "twitter:image": string
  "twitter:site": string
  "msapplication-square310x310logo": string
  viewport: string
  "twitter:description": string
  "csrf-token": string
  requirejs: string
  "og:url": string
}

interface Csethumbnail {
  src: string
  width: string
  height: string
}

interface Product {
  image: string
  name: string
  genre: string
  description: string
}

interface Aggregaterating {
  ratingvalue: string
  ratingcount: string
  worstrating: string
  bestrating: string
}
