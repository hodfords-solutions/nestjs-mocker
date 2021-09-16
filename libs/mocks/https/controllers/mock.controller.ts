import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MockService } from '../../services/mock.service';
import { CustomRequest } from '../../decorators/custom-request.decorator';

@Controller('mocks')
@ApiTags('Mocks')
export class MockController {
    constructor(private readonly mockApiService: MockService) {}

    @Get('*')
    @ApiOperation({
        description: 'Get response of mock api for GET method'
    })
    getResponseForGetMethod(@CustomRequest() customRequest: CustomRequest) {
        console.log('here');
        return this.mockApiService.getMockApiResponse(customRequest);
    }

    @Put('*')
    @ApiOperation({
        description: 'Get response of mock api for POST method'
    })
    getResponseForPutMethod(@CustomRequest() customRequest: CustomRequest) {
        return this.mockApiService.getMockApiResponse(customRequest);
    }

    @Patch('*')
    @ApiOperation({
        description: 'Get response of mock api for PATCH method'
    })
    getResponseForPatchMethod(@CustomRequest() customRequest: CustomRequest) {
        return this.mockApiService.getMockApiResponse(customRequest);
    }

    @Post('*')
    @ApiOperation({
        description: 'Get response of mock api for POST method'
    })
    getResponseForPostMethod(@CustomRequest() customRequest: CustomRequest) {
        return this.mockApiService.getMockApiResponse(customRequest);
    }

    @Delete('*')
    @ApiOperation({
        description: 'Get response of mock api for DELETE method'
    })
    getResponseForDeleteMethod(@CustomRequest() customRequest: CustomRequest) {
        return this.mockApiService.getMockApiResponse(customRequest);
    }
}
