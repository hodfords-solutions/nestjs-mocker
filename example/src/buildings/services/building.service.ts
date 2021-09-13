import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BuildingRepository } from '~buildings/repositories/building.repository';

@Injectable()
export class BuildingService {
    public constructor(@InjectRepository(BuildingRepository) private buildingRepo: BuildingRepository) {}

    async list() {
        return await this.buildingRepo.find();
    }
}
