import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { BullModule } from "@nestjs/bull";
import { MAIL_QUEUE } from "./mail.constants";
import { MailProcessor } from "./processors/mail.processor";
import { MailService } from "./mail.service";
import { MailController } from "./mail.controller";
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get("EMAIL_HOST"),
          port: configService.get("EMAIL_PORT"),
          secure: true,
          auth: {
            user: configService.get("EMAIL_ADDRESS"),
            pass: configService.get("EMAIL_PASSWORD"),
          },
          tls: { rejectUnauthorized: false },
        },
        defaults: { from: 'Fresher K2 Mailer" <test@test.com>' }, 
        template: {
          dir: __dirname + "/templates", 
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
    JwtModule.register({}),
    UserModule
  ],
  providers: [MailProcessor, MailService],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}