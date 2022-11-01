import * as dotenv from "dotenv";
import * as cookieParser from 'cookie-parser';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  let cors = require("cors");

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({ 
      transform: true,
      whitelist: true
    })
  );
  app.use(cors({
    origin: configService.get('FRONTEND'),
    credentials: true,
  }));

  const config = new DocumentBuilder()
    .setTitle("Facebook")
    .setDescription("Facebook API")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8000);
}
bootstrap();
