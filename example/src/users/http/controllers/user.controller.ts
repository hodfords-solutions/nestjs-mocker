import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '~users/services/user.service';

@Controller('users')
@ApiTags('Users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('')
    async list() {
        return this.userService.list();
    }
}
