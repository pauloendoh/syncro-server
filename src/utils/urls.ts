import { config } from "dotenv"
config()

const { UPLOADS_BASE_URL } = process.env

export const urls = {
  publicUploads: (fileName: string) => `${UPLOADS_BASE_URL}/${fileName}`,
  movieResults: "https://imdb8.p.rapidapi.com/title/v2/find",
  imdbTitleDetails: "https://imdb8.p.rapidapi.com/title/get-overview-details",
}
