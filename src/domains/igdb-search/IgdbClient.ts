import { urls } from "../../utils/urls"
import { IgdbSearchDto } from "./types/IgdbSearchDto"
import igdbAxios from "./utils/igdbAxios"

export class IgdbClient {
  constructor(private axios = igdbAxios) {}

  async searchGame(title: string) {
    return this.axios.post<IgdbSearchDto[]>(
      urls.igdbGames,
      `
      search "${title}"; fields rating,rating_count, name, first_release_date, summary;
where name = "${title}" & rating_count > 0;
    `
    )
  }

  async searchGameTitles(titles: string[]) {
    if (titles.length === 0) return []

    const whereQuery = titles
      .map((t) => `name = "${t}" & rating_count > 0`)
      .join(" | ")

    return this.axios
      .post<IgdbSearchDto[]>(
        urls.igdbGames,
        `fields rating,rating_count, name, first_release_date, summary;
where ${whereQuery};
    `
      )
      .then((res) => res.data)
  }
}
