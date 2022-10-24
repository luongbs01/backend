import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import * as Joi from '@hapi/joi';
import { MailModule } from './modules/mail/mail.module';
import { PostModule } from './modules/post/post.module';

export const Modules = [
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: 'fresherk2',
    entities: [__dirname + '/model/entities/**/*{.ts,.js}'],
    synchronize: true,
    timezone: 'Z'
  }),
  BullModule.forRoot({
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    },
  }),
  ConfigModule.forRoot({
    validationSchema: Joi.object({
      EMAIL_HOST: Joi.string().required(),
      EMAIL_PORT: Joi.number().required(),
      EMAIL_ADDRESS: Joi.string().required(),
      EMAIL_PASSWORD: Joi.string().required(),
      REDIS_HOST: Joi.string().required(),
      REDIS_PORT: Joi.number().required(),
      FRONTEND: Joi.string().required(),
      JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
      JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
      JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
      JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      JWT_RESET_PASSWORD_TOKEN_SECRET: Joi.string().required(),
      JWT_RESET_PASSWORD_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    })
  }),
  MailModule,
  UserModule,
  AuthModule,
  PostModule
];