import { DynamicModule, Global, Module, ValueProvider } from '@nestjs/common';
import { CONFIG_OPTIONS } from './mocks/constants/config-options.constant';
import { MockService } from './mocks/services/mock.service';
import { MockCreatorService } from './mocks/services/mock-creator.service';
import { MockOptions } from './mocks/interfaces/mock-options.interface';
import { SwaggerService } from './mocks/services/swagger.service';
import { MockController } from './mocks/https/controllers/mock.controller';
import { MockCreatorController } from './mocks/https/controllers/mock-creator.controller';

@Global()
@Module({})
export class MockModule {
    static forRoot(options: MockOptions): DynamicModule {
        const optionProvider: ValueProvider<MockOptions> = {
            provide: CONFIG_OPTIONS,
            useValue: options
        };

        return {
            module: MockModule,
            providers: [optionProvider, MockService, MockCreatorService, SwaggerService],
            controllers: [MockController, MockCreatorController],
            exports: [MockService, MockCreatorService]
        };
    }
}
