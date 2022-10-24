import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/model/entities/user.entity';
import { UserRepository } from 'src/model/repositories/user.repository';
import { UserController } from 'src/modules/user/user.controller';
import { UserService } from 'src/modules/user/user.service';
import { AVATAR_QUEUE } from './user.constants';
import { AvatarProcessor } from './processors/avatar.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    BullModule.registerQueue({
      name: AVATAR_QUEUE,
    })
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, UserRepository, AvatarProcessor],
})
export class UserModule {}