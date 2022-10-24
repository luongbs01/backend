import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bull";
import { CreatePostDto } from "../dtos/create-post.dto";
import { POST_IMAGE_QUEUE, RESIZING_POST_IMAGE } from "../post.constants";

@Injectable()
@Processor(POST_IMAGE_QUEUE)
export class PostImageProcessor {
  private logger = new Logger(PostImageProcessor.name);
  
  constructor() {}

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

  @Process(RESIZING_POST_IMAGE)
  public async resizePostImage(job: Job<{ userId: number, createPostDto: CreatePostDto, file: Express.Multer.File }>) {
    this.logger.log("Resizing and saving post image");

    const sharp = require('sharp');

    try {

      sharp(job.data.file.path).resize({width: 584, height: 342}).toFile('./uploads/post/images/584x342/' + job.data.file.filename);

      
    } catch(error) {
      this.logger.error("Failed to resize and save post images");
    }
  }
}