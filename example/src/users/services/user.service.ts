import { Global, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '~users/repositories/user.repository';

@Global()
@Injectable()
export class UserService {
    public constructor(@InjectRepository(UserRepository) private userRepo: UserRepository) {}

    public list() {
        return this.userRepo.find();
    }
}
