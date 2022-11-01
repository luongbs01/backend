import { PostEntity } from 'src/model/entities/post.entity';
import { Repository } from 'typeorm';

export class PostRepository extends Repository<PostEntity> {}
