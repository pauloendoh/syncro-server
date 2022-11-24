import { UserTokenRepository } from "../../user-token/UserTokenRepository"

type ExecParams = { requesterId: string; pushToken: string }

export class UseLogoutPushToken {
  constructor(private tokenRepo = new UserTokenRepository()) {}

  exec = async ({ requesterId, pushToken }: ExecParams) => {
    return this.tokenRepo.deletePushToken(requesterId, pushToken)
  }
}
