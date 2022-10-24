import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { CONFIRM_REGISTRATION, MAIL_QUEUE, RESET_PASSWORD } from "./mail.constants";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { ConfigService } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt';
import { UserService } from "../user/user.service";

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);

  constructor(
    @InjectQueue(MAIL_QUEUE) 
    private mailQueue: Queue,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService
  ) {}

  public async sendConfirmationEmail(email: string): Promise<void> {
    try {     
      await this.mailQueue.add(CONFIRM_REGISTRATION, {
        email
      });
    } catch(error) {
      this.logger.error(`Failed to send registration email to user ${email} to queue`);
    }
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'verifyEmail' in payload) {
        return payload.verifyEmail;
      }
    } catch(error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      } else {
        throw new BadRequestException('Bad token');
      }
    }
  }

  public async verifyUserEmail(email: string) {
    const user = await this.userService.getUserByEmail(email);

    if (user.isVerified) {
      throw new BadRequestException('Email is already confirmed');
    }

    await this.userService.makeUserVerified(email);
  }

  public async resendConfirmationEmail(id: number) {
    const user = await this.userService.getUserById(id);

    if (user.isVerified) {
      throw new BadRequestException('User is already verified');
    }

    await this.sendConfirmationEmail(user.email);
  }

  public async sendForgotPasswordEmail(email: string): Promise<void> {
    try {     
      await this.mailQueue.add(RESET_PASSWORD, {
        email
      });
    } catch(error) {
      this.logger.error(`Failed to send reset password email to user ${email} to queue`);
    }
  }

  async decodeResetPasswordToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_RESET_PASSWORD_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'resetPasswordEmail' in payload) {
        return payload.resetPasswordEmail;
      }
    } catch(error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Reset password token expired');
      } else {
        throw new BadRequestException('Bad token');
      }
    }
  }
}