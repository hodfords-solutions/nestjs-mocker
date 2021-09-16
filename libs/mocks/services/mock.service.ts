import { Inject, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { CONFIG_OPTIONS } from '../constants/config-options.constant';
import { MockOptions } from '../interfaces/mock-options.interface';
import { CustomRequest } from '../decorators/custom-request.decorator';

@Injectable()
export class MockService {
    constructor(@Inject(CONFIG_OPTIONS) private options: MockOptions) {}

    private parseMockApiResponseData() {
        return JSON.parse(readFileSync(resolve(this.options.path), { encoding: 'utf-8' }));
    }

    public getMockApiResponse(request: CustomRequest) {
        const { endpoint, method } = request;
        const data = this.parseMockApiResponseData();
        return data.responses[endpoint]?.[method];
    }
}
