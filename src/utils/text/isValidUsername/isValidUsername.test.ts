import { BadRequestError } from "routing-controllers"
import { describe, expect, it } from "vitest"
import { validateUsernameOrThrow } from "./validateUsernameOrThrow"

describe("isValidUsername", () => {
  it("should return true if username is valid", () => {
    expect(validateUsernameOrThrow("username")).toBe(true)
  })

  it("should return false if username is invalid", () => {
    expect(() => validateUsernameOrThrow("username!1çç")).toThrow(
      BadRequestError
    )

    expect(() => validateUsernameOrThrow("Maurício 'Maumau'")).toThrow(
      BadRequestError
    )
  })
})
