import { BadRequestError } from "routing-controllers"
import { DidNotFindRepository } from "./DidNotFindRepository"

export class DidNotFindService {
  constructor(private didNotFindRepository = new DidNotFindRepository()) {}

  async createDidNotFind(params: {
    userId: string
    query: string
    type: string
  }) {
    const alreadyExists = await this.didNotFindRepository.alreadyExists(params)
    if (alreadyExists)
      throw new BadRequestError(
        "You already submitted a feedback for this item."
      )

    return this.didNotFindRepository.createDidNotFind(params)
  }
}
