import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingService } from '~buildings/services/building.service';
import { BuildingController } from '~buildings/http/controllers/building.controller';
import { BuildingRepository } from '~buildings/repositories/building.repository';
import { BuildingEntity } from '~buildings/entities/building.entity';

@Module({
    providers: [BuildingService],
    controllers: [BuildingController],
    exports: [BuildingService],
    imports: [TypeOrmModule.forFeature([BuildingEntity, BuildingRepository])]
})
export class BuildingModule {}
