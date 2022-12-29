import { BadRequestError } from "routing-controllers"

export const validateUsernameOrThrow = (username: string) => {
  // Checking if username is valid
  const regex = new RegExp(/^[a-zA-Z0-9]+$/)

  if (!regex.test(username)) throw new BadRequestError("Invalid characters")
  if (username.length <= 3)
    throw new BadRequestError("Username must have at least 3 characters")
  if (username.length >= 16)
    throw new BadRequestError(
      "Username must not be greather than 16 characters"
    )

  return true
}
