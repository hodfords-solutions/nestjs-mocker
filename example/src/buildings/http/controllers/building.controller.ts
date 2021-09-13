import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BuildingService } from '~buildings/services/building.service';

@Controller('buildings')
@ApiTags('Buildings')
export class BuildingController {
    constructor(private buildingService: BuildingService) {}

    @Get()
    @ApiOperation({
        description: 'Get list of buildings and can be sorted by name or createdAt'
    })
    async index() {
        return await this.buildingService.list();
    }
}
