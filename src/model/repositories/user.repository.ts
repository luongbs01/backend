import { UserEntity } from 'src/model/entities/user.entity';
import { Repository } from 'typeorm';

export class UserRepository extends Repository<UserEntity> {}
