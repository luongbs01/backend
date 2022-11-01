import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import UserEntity from './user.entity';

@Entity()
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts)
  author: UserEntity;

  @CreateDateColumn({})
  createdAt: Date;

  @Column()
  content: string;

  @Column({
    default: null,
  })
  image: string;

  @Column()
  likes: number;
}

export default PostEntity;
