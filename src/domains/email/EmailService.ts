import { MailService } from "@sendgrid/mail"
import { isEmail } from "class-validator"
import { BadRequestError } from "routing-controllers"
import { UserTokenRepository } from "../user-token/UserTokenRepository"
import { UserRepository } from "../user/UserRepository"

export class EmailService {
  constructor(
    private sendgridService = new MailService(),
    private userRepo = new UserRepository(),
    private tokenRepo = new UserTokenRepository()
  ) {
    this.sendgridService.setApiKey(String(process.env.SENDGRID_API_KEY))
  }

  notifyNewUserToDevs(username: string) {
    const devsEmailsString = process.env.NOTIFY_NEW_USER_TO_DEVS

    if (!devsEmailsString?.trim()) return

    const devsEmails = devsEmailsString.split(";").map((s) => s.trim())

    this.sendgridService
      .send({
        to: devsEmails,
        from: "endohpa@gmail.com",
        subject: "New user in Syncro - " + username,
        text: "congrats to us :)",
      })
      .then(() => {
        console.log("Email sent!")
      })
      .catch((error) => {
        console.log(error.message)
      })
  }

  async sendPasswordResetEmail(email: string) {
    email = email.trim()
    if (!isEmail(email)) throw new BadRequestError("Invalid email.")

    const registeredUser = await this.userRepo.findUserByEmail(email)
    if (!registeredUser) return true

    await this.tokenRepo.deleteAllPasswordResetTokens(registeredUser.id)

    const token = await this.tokenRepo.createPasswordResetToken(
      registeredUser.id
    )

    this.sendgridService
      .send({
        from: "endohpa@gmail.com",
        to: registeredUser.email,
        subject: "Syncro - Password reset code", // Subject line
        text: `${token.token}`,
        // html: `Enter this link to complete your password reset: <br/>
        //     <a href="${url}">${url}</a>
        // `,
      })
      .then(() => {
        console.log("Email sent!")
      })
      .catch((error) => {
        console.log(error.message)
      })

    return true
  }
}
