import { FeedRepository } from "./FeedRepository"

export class FeedService {
  constructor(private feedRepo = new FeedRepository()) {}

  findHomeItems = async (requesterId: string) => {
    return this.feedRepo.findHomeItems(requesterId)
  }
}
