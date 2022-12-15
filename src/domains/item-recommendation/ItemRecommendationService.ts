import { ItemRecommendationRepository } from "./ItemRecommendationRepository"

export class ItemRecommendationService {
  constructor(
    private recommendationRepo = new ItemRecommendationRepository()
  ) {}

  async findItemRecommendationsFromUser(requesterId: string) {
    return this.recommendationRepo.findItemRecommendationsFromUser(requesterId)
  }
}
