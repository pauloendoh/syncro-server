import { config } from "dotenv"
config()

const { UPLOADS_BASE_URL } = process.env

export const urls = {
  publicUploads: (fileName: string) => `${UPLOADS_BASE_URL}/${fileName}`,
  imdbTitles: (apiNumber = 1) =>
    apiNumber === 1
      ? "https://imdb8.p.rapidapi.com/title/v2/find"
      : "https://online-movie-database.p.rapidapi.com/title/v2/find",
  imdbTitleDetails: (apiNumber = 1) =>
    apiNumber === 1
      ? "https://imdb8.p.rapidapi.com/title/get-overview-details"
      : "https://online-movie-database.p.rapidapi.com/title/get-overview-details",
  igdbGames: "https://api.igdb.com/v4/games",
  malProfile: (username: string) =>
    `https://myanimelist.net/profile/${username}`,
  malUserAnimeList: (username: string) =>
    `https://myanimelist.net/animelist/${username}`,
}
