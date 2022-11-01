import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Job } from 'bull';
import {
  CONFIRM_REGISTRATION,
  MAIL_QUEUE,
  RESET_PASSWORD,
} from '../mail.constants';
import VerificationTokenPayload from '../interfaces/verification-token-payload.interface';
import ResetPasswordTokenPayload from '../interfaces/reset-password-token-payload.interface';

@Injectable()
@Processor(MAIL_QUEUE)
export class MailProcessor {
  private logger = new Logger(MailProcessor.name);

  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  @OnQueueActive()
  public onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process(CONFIRM_REGISTRATION)
  public async confirmRegistration(job: Job<{ email: string }>) {
    this.logger.log(`Sending confirm registration mail to '${job.data.email}'`);

    const verifyEmail = job.data.email;
    const payload: VerificationTokenPayload = { verifyEmail };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    const url = `${this.configService.get(
      'FRONTEND',
    )}/confirm-email?token=${token}`;

    try {
      return this.mailerService.sendMail({
        to: verifyEmail,
        from: this.configService.get('EMAIL_ADDRESS'),
        subject: 'Registration',
        template: './registration',
        context: { confirmUrl: url },
      });
    } catch {
      this.logger.error(
        `Failed to send confirm registration mail to '${verifyEmail}`,
      );
    }
  }

  @Process(RESET_PASSWORD)
  public async resetPassword(job: Job<{ email: string }>) {
    this.logger.log(`Sending reset password mail to '${job.data.email}'`);

    const resetPasswordEmail = job.data.email;
    const payload: ResetPasswordTokenPayload = { resetPasswordEmail };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_RESET_PASSWORD_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_RESET_PASSWORD_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    const url = `${this.configService.get(
      'FRONTEND',
    )}/reset-password?token=${token}`;

    try {
      return this.mailerService.sendMail({
        to: resetPasswordEmail,
        from: this.configService.get('EMAIL_ADDRESS'),
        subject: 'Reset password',
        template: './forgot-password',
        context: { resetPasswordUrl: url },
      });
    } catch {
      this.logger.error(
        `Failed to send reset password mail to '${resetPasswordEmail}`,
      );
    }
  }
}
