import { DynamicModule, Module, ValueProvider } from '@nestjs/common';
import { MockApiCreatorController } from '~mocks/http/controllers/mock-api-creator.controller';
import { MockApiController } from '~mocks/http/controllers/mock-api.controller';
import { MockApiCreatorService } from '~mocks/services/mock-api-creator.service';
import { SwaggerService } from '~mocks/services/swagger.service';
import { MockApiService } from '~mocks/services/mock-api.service';
import { MOCK_API_PATH } from '~mocks/constants/mock-api-path.constant';
import { MockApiOptions } from '~mocks/interfaces/mock-api-options.interface';
import { MAXIMUM_RANDOM_RESPONSE } from '~mocks/constants/maximum-random-response.constant';

@Module({
    providers: [MockApiCreatorService, MockApiService, SwaggerService],
    controllers: [MockApiCreatorController, MockApiController],
    imports: [],
    exports: []
})
export class MockApiModule {
    static forRoot(options: MockApiOptions): DynamicModule {
        const mockApiPathProvider: ValueProvider<string> = {
            provide: MOCK_API_PATH,
            useValue: options.path
        };

        const maximumRandomResponse: ValueProvider<number> = {
            provide: MAXIMUM_RANDOM_RESPONSE,
            useValue: options.maximumRandomResponse || 10
        };

        return {
            module: MockApiModule,
            providers: [mockApiPathProvider, maximumRandomResponse],
            exports: []
        };
    }
}
