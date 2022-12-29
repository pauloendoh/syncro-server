import { BadRequestError } from "routing-controllers"
import { instance, mock, when } from "ts-mockito"
import { describe, expect, test, vi } from "vitest"
import { buildUser } from "../../../utils/entityBuilders"
import { AuthRepository } from "../AuthRepository"
import { buildLoginDto } from "../types/LoginDto"
import { AuthService } from "./AuthService"

describe("AuthService", () => {
  describe("login", () => {
    test("when I miss my password -> it should throw correct error", async () => {
      const payload = buildLoginDto()

      const authRepoMock = mock(AuthRepository)
      when(
        authRepoMock.findUserByUsernameEmail(payload.identificator)
      ).thenResolve(buildUser())

      const sut = new AuthService(
        instance(authRepoMock),
        undefined,
        undefined,
        undefined
      )

      vi.mock("bcrypt", () => ({
        compare: () => Promise.resolve(false),
      }))

      try {
        await sut.login(payload, "xd")
      } catch (e) {
        if (e instanceof BadRequestError) {
          expect(e.message).toBe("Password not correct")
          return
        }
        throw e
      }
    })
  })
})
