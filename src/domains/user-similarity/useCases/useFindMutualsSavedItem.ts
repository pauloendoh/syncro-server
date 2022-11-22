import { FollowRepository } from "../../follow/FollowRepository"
import { UserRepository } from "../../user/UserRepository"

type ExecParams = { requesterId: string; itemId: string }

export class useFindMutualsSavedItem {
  constructor(
    private userRepo = new UserRepository(),
    private followRepo = new FollowRepository()
  ) {}

  exec = async ({ requesterId, itemId }: ExecParams) => {
    const mutuals = await this.followRepo.findMutuals(requesterId)
    const mutualIds = mutuals.map((m) => m.id)

    const usersSavedItemId = await this.userRepo.usersSavedItemId(
      mutualIds,
      itemId
    )

    return usersSavedItemId.map((u) => ({
      user: u,
      isSaved: u.interests.length > 0 || u.ratings.length > 0,
    }))
  }
}
