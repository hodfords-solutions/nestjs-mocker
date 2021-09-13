import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '~users/services/user.service';
import { UserController } from '~users/http/controllers/user.controller';
import { UserRepository } from '~users/repositories/user.repository';
import { UserEntity } from '~users/entities/user.entity';

@Module({
    providers: [UserService],
    controllers: [UserController],
    exports: [],
    imports: [TypeOrmModule.forFeature([UserRepository, UserEntity])]
})
export class UserModule {}
