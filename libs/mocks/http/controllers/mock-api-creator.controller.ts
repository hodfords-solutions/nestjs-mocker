import { Body, Controller, Get, Post, Render } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { MockApiCreatorService } from "~mocks/services/mock-api-creator.service";
import { CreateMockApiDto } from "~mocks/dtos/create-mock-api.dto";
import { RequestMethodEnum } from "~mocks/enums/request-method.enum";
import { TypeSelectionEnum } from "~mocks/enums/type-selection.enum";

@Controller("mock-api-creator")
export class MockApiCreatorController {
  constructor(private mockApiCreatorService: MockApiCreatorService) {}

  @Post()
  @ApiOperation({
    description: "Create a new mocking api endpoint",
  })
  create(@Body() dto: CreateMockApiDto) {
    return this.mockApiCreatorService.createMockApi(dto);
  }

  @Get("")
  @ApiOperation({
    description: "Create mock api page",
  })
  @Render("mock-api-creator")
  loadMockApiCreatePage() {
    const fakerMethods = MockApiCreatorService.listFakerMethods();
    const entities = MockApiCreatorService.getCurrentEntities([
      "File",
      "User",
      "Otp",
    ]);
    const requestMethods = Object.keys(RequestMethodEnum);
    const typeSelection = Object.keys(TypeSelectionEnum);
    const delaySelection = ["0", "1", "3", "5", "8"];

    return {
      entities,
      fakerMethods,
      requestMethods,
      typeSelection,
      delaySelection,
    };
  }
}
