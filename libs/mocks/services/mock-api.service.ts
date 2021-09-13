import { Inject, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { CustomRequest } from '~mocks/decorators/custom-request.decorator';
import { MOCK_API_PATH } from '~mocks/constants/mock-api-path.constant';

@Injectable()
export class MockApiService {
    constructor(@Inject(MOCK_API_PATH) private mockApiPath) {}

    private parseMockApiResponseData() {
        return JSON.parse(readFileSync(resolve(this.mockApiPath), { encoding: 'utf-8' }));
    }

    public getMockApiResponse(request: CustomRequest) {
        const { endpoint, method } = request;
        const data = this.parseMockApiResponseData();
        return data.responses[endpoint]?.[method];
    }
}
