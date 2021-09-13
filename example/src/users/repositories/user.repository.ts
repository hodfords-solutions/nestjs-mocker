import { EntityRepository } from 'typeorm';
import { BaseRepository } from '@diginexhk/typeorm-helper';
import { UserEntity } from '~users/entities/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {}
