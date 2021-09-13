import { DynamicModule, Module, ValueProvider } from "@nestjs/common";
import { MockApiCreatorController } from "~mocks/http/controllers/mock-api-creator.controller";
import { MockApiController } from "~mocks/http/controllers/mock-api.controller";
import { MockApiCreatorService } from "~mocks/services/mock-api-creator.service";
import { SwaggerService } from "~mocks/services/swagger.service";
import { MockApiService } from "~mocks/services/mock-api.service";
import { MockApiOptions } from "~mocks/interfaces/mock-api-options.interface";
import { CONFIG_OPTIONS } from "~mocks/constants/config-options.constant";

@Module({
  providers: [MockApiCreatorService, MockApiService, SwaggerService],
  controllers: [MockApiCreatorController, MockApiController],
  imports: [],
  exports: [],
})
export class MockApiModule {
  static forRoot(options: MockApiOptions): DynamicModule {
    const optionProvider: ValueProvider<MockApiOptions> = {
      provide: CONFIG_OPTIONS,
      useValue: options,
    };

    return {
      module: MockApiModule,
      providers: [optionProvider, MockApiService, MockApiCreatorService],
      exports: [],
    };
  }
}
