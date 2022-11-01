import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import * as fs from 'fs';
import PostEntity from 'src/model/entities/post.entity';
import { PostRepository } from 'src/model/repositories/post.repository';
import { UserService } from '../user/user.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { POST_IMAGE_QUEUE, RESIZING_POST_IMAGE } from './post.constants';

@Injectable()
export class PostService {
  private logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(PostEntity)
    private postRepo: PostRepository,
    @InjectQueue(POST_IMAGE_QUEUE)
    private postImageQueue: Queue,
    private userService: UserService,
  ) {}

  async getPostById(id: number): Promise<PostEntity> {
    return await this.postRepo.findOneBy({ id });
  }

  async create(
    userId: number,
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
  ): Promise<PostEntity> {
    const newPost = this.postRepo.create(createPostDto);

    const author = await this.userService.getUserById(userId);
    delete author.password;
    delete author.currentRefreshToken;
    delete author.email;
    newPost.author = author;

    if (!file && newPost.content.length === 0) {
      throw new HttpException('Your post is empty', HttpStatus.BAD_REQUEST);
    }

    if (file) {
      newPost.image = file.filename;

      try {
        this.postImageQueue.add(RESIZING_POST_IMAGE, {
          userId,
          createPostDto,
          file,
        });
      } catch (error) {
        this.logger.error(`Failed to send post image ${file} to queue`);
      }
    }

    return await this.postRepo.save(newPost);
  }

  async findWithAuthor(
    userId: number,
    take: number,
    skip: number,
  ): Promise<PostEntity[]> {
    return await this.postRepo
      .createQueryBuilder('P')
      .where('P.authorId = :userId', { userId: userId })
      .orderBy('P.createdAt', 'DESC')
      .take(take)
      .skip(skip)
      .getMany();
  }

  async deletePost(id: number) {
    const post = await this.getPostById(id);

    fs.unlink('./uploads/post/images/584x342/' + post.image, (err) => {
      if (err) {
        console.error(err);
        return err;
      }
    });

    fs.unlink('./uploads/post/images/original/' + post.image, (err) => {
      if (err) {
        console.error(err);
        return err;
      }
    });

    return this.postRepo.delete(id);
  }
}
