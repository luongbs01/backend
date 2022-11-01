import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostEntity from 'src/model/entities/post.entity';
import { PostRepository } from 'src/model/repositories/post.repository';
import { UserModule } from '../user/user.module';
import { POST_IMAGE_QUEUE } from './post.constants';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostImageProcessor } from './processors/post-image.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    BullModule.registerQueue({
      name: POST_IMAGE_QUEUE,
    }),
    UserModule,
  ],
  exports: [PostService],
  controllers: [PostController],
  providers: [PostService, PostRepository, PostImageProcessor],
})
export class PostModule {}
