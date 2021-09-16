import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MockCreatorService } from '../../services/mock-creator.service';
import { CreateMockApiDto } from '../../dtos/create-mock-api.dto';
import { RequestMethodEnum } from '../../enums/request-method.enum';
import { TypeSelectionEnum } from '../../enums/type-selection.enum';

@Controller('mock-api-creator')
export class MockCreatorController {
    constructor(private mockApiCreatorService: MockCreatorService) {}

    @Post()
    @ApiOperation({
        description: 'Create a new mocking api endpoint'
    })
    create(@Body() dto: CreateMockApiDto) {
        return this.mockApiCreatorService.createMockApi(dto);
    }

    @Get()
    @ApiOperation({
        description: 'Create mock api page'
    })
    @Render('mock-api-creator')
    loadMockApiCreatePage() {
        console.log('here');
        const fakerMethods = MockCreatorService.listFakerMethods();
        const entities = MockCreatorService.getCurrentEntities(['File', 'User', 'Otp']);
        const requestMethods = Object.keys(RequestMethodEnum);
        const typeSelection = Object.keys(TypeSelectionEnum);
        const delaySelection = ['0', '1', '3', '5', '8'];

        return {
            entities,
            fakerMethods,
            requestMethods,
            typeSelection,
            delaySelection
        };
    }
}
