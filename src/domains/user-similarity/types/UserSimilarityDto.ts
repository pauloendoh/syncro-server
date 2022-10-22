import { SimpleUserDto } from "../../user/types/SimpleUserDto"

export interface UserSimilarityDto {
  userB: SimpleUserDto
  userARatedCount: number
  ratingsSimilarityAvgPercentage: number
  ratedSameItemsCount: number
  percentageQuantityFromUserA: number
  overallPercentage: number
}
