import axios from "axios"
import { NotFoundError } from "routing-controllers"
import { urls } from "../../../utils/urls"
import { MalRatingImportService } from "../../mal-rating-import/MalRatingImportService"

export class _StartMyAnimeListImport {
  constructor(private malRatingImport = new MalRatingImportService()) {}

  async exec(requesterId: string, username: string) {
    username = username.trim()

    await axios.get(urls.myAnimeListUsername(username)).catch(() => {
      throw new NotFoundError("MyAnimeList user not found.")
    })

    this.malRatingImport.init(requesterId, username)

    return true
  }
}
