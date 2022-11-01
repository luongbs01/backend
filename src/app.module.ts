import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Modules } from 'src/module';

@Module({
  imports: Modules,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
