import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { UserService } from "../user/user.service";
import ConfirmEmailDto from "./dtos/confirm-email.dto";
import ResetPasswordEmailDto from "./dtos/reset-password-email.dto";
import { MailService } from "./mail.service";

@Controller('email')
export class MailController {
  constructor(
    private mailService: MailService,
    private userService: UserService
  ) {}

  @Post('confirm') 
  async confirm(@Body() confirmData: ConfirmEmailDto) {
    const email = await this.mailService.decodeConfirmationToken(confirmData.token);
    await this.mailService.verifyUserEmail(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordData: ResetPasswordEmailDto) {
    const email = await this.mailService.decodeResetPasswordToken(resetPasswordData.token);
    
    if (email) {
      await this.userService.setNewPassword(email, resetPasswordData.password);
    }
  }
}