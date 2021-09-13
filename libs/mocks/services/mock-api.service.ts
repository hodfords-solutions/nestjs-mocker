import { Inject, Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import { resolve } from "path";
import { CustomRequest } from "~mocks/decorators/custom-request.decorator";
import { CONFIG_OPTIONS } from "~mocks/constants/config-options.constant";
import { MockApiOptions } from "~mocks/interfaces/mock-api-options.interface";

@Injectable()
export class MockApiService {
  constructor(@Inject(CONFIG_OPTIONS) private options: MockApiOptions) {}

  private parseMockApiResponseData() {
    return JSON.parse(
      readFileSync(resolve(this.options.path), { encoding: "utf-8" })
    );
  }

  public getMockApiResponse(request: CustomRequest) {
    const { endpoint, method } = request;
    const data = this.parseMockApiResponseData();
    return data.responses[endpoint]?.[method];
  }
}
