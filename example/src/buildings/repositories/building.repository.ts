import { EntityRepository } from 'typeorm';
import { BaseRepository } from '@diginexhk/typeorm-helper';
import { BuildingEntity } from '~buildings/entities/building.entity';

@EntityRepository(BuildingEntity)
export class BuildingRepository extends BaseRepository<BuildingEntity> {}
