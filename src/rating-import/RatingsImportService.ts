import { NotFoundError } from "routing-controllers"
import { RatingsImportRepository } from "./RatingsImportRepository"

export class RatingsImportService {
  constructor(
    private ratingsImportRepository = new RatingsImportRepository()
  ) {}

  async getImportItemsByRequestId(importRequestId: string, userId: string) {
    const foundRequest = await this.ratingsImportRepository.findImportRequestById(
      importRequestId
    )

    if (!foundRequest || foundRequest.userId !== userId) {
      throw new NotFoundError("Import request not found")
    }

    const importItems = await this.ratingsImportRepository.findImportItemsByRequestId(
      importRequestId,
      userId
    )

    return importItems
  }
}
