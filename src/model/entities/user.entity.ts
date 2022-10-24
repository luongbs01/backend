import { Exclude } from 'class-transformer';
import { DEFAULT_AVATAR } from 'src/modules/user/user.constants';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import PostEntity from './post.entity';

@Entity()
export class UserEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: null
  })
  name: string;

  @Column({})
  @Exclude()
  password: string;

  @Column({
    unique: true
  })
  email: string;

  @Column({
    default: DEFAULT_AVATAR
  })
  avatar: string;
  
  @Column({
    default: null
  })
  location: string;

  @Column({
    default: null
  })
  bio: string;

  @Column('date')
  birthday: Date;

  @Column({
    default: null
  })
  facebook: string;

  @Column({
    default: null
  })
  instagram: string;
  
  @Column({
    default: null
  })
  linkedin: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({
    nullable: true
  })
  @Exclude()
  currentRefreshToken: string;

  @OneToMany(() => PostEntity, (postEntity) => postEntity.author)
  posts: PostEntity[];
}

export default UserEntity;