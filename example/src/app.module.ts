import { Module } from '@nestjs/common';
import { databaseConfig } from '~config/database.config';
import { BuildingModule } from '~buildings/building.module';
import { UserModule } from '~users/user.module';
import { mockApiConfig } from '~config/mock-api.config';

@Module({
    imports: [databaseConfig, mockApiConfig, BuildingModule, UserModule],
    controllers: [],
    providers: []
})
export class AppModule {}
