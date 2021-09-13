import { Inject, Injectable } from "@nestjs/common";
import { CreateMockApiDto } from "~mocks/dtos/create-mock-api.dto";
import * as faker from "faker";
import { v4 as uuidv4 } from "uuid";
import { CreatePropertyDto } from "~mocks/dtos/create-property.dto";
import { TypeSelectionEnum } from "~mocks/enums/type-selection.enum";
import { FakerType } from "~mocks/interfaces/faker-type.interface";
import { SwaggerService } from "~mocks/services/swagger.service";
import {
  isArrayOfObjectType,
  isArrayOfPrimitiveType,
  isEnumType,
  isObjectType,
  isPrimitive,
} from "~mocks/helpers/check-type.helper";
import { readFileSync, writeFileSync } from "fs";
import { UpdateMockApiJson } from "~mocks/interfaces/update-mock-api-json.interface";
import { map } from "lodash";
import { getMetadataArgsStorage } from "typeorm";
import { ColumnMetaArgs } from "~mocks/interfaces/column-meta-args.interface";
import { CONFIG_OPTIONS } from "~mocks/constants/config-options.constant";
import { MockApiOptions } from "~mocks/interfaces/mock-api-options.interface";

@Injectable()
export class MockApiCreatorService {
  constructor(
    @Inject(CONFIG_OPTIONS) private options: MockApiOptions,
    private swaggerService: SwaggerService
  ) {}

  static listFakerMethods() {
    const fakerMethods = [
      "address",
      "commerce",
      "company",
      "database",
      "datatype",
      "date",
      "finance",
      "git",
      "hacker",
      "helpers",
      "image",
      "internet",
      "lorem",
      "name",
      "music",
      "phone",
      "random",
      "system",
      "time",
      "vehicle",
    ];
    return fakerMethods.map((category) => ({
      category,
      methods: Object.keys(faker[category]),
    }));
  }

  static getCurrentEntities(
    excludes: string[] = []
  ): Record<string, ColumnMetaArgs[]> {
    const tables = getMetadataArgsStorage().tables;
    const columns = getMetadataArgsStorage().columns;
    const mapColumnsToTable = tables.reduce((acc, table) => {
      if (!excludes.includes(table.name)) {
        acc[table.name] = [];
      }
      return acc;
    }, {});

    for (const {
      target,
      propertyName,
      options: { type, nullable },
    } of columns) {
      const columnData = {
        key: propertyName,
        type,
        isRequired: !nullable,
      };

      const table = Object.getOwnPropertyDescriptor(
        target,
        "name"
      ).value.replace("Entity", "");
      if (!excludes.includes(table)) {
        mapColumnsToTable[table]?.push(columnData);
      }
    }
    return mapColumnsToTable;
  }

  static generateValueByType(
    type: TypeSelectionEnum,
    fakerType?: FakerType,
    overrideValue?: string | number
  ): string | number | boolean | Date {
    if (overrideValue) {
      return overrideValue;
    }
    switch (type) {
      case TypeSelectionEnum.UUID:
        return uuidv4();
      case TypeSelectionEnum.STRING:
        return faker.name.title();
      case TypeSelectionEnum.NUMBER:
        return faker.datatype.number();
      case TypeSelectionEnum.BOOLEAN:
        return Math.floor(Math.random() * 3) > 1;
      case TypeSelectionEnum.DATE:
        return faker.date.future().getTime();
      case TypeSelectionEnum.FAKER:
        const { category, method } = fakerType;
        return faker[category][method]();
    }
  }

  static generateNestedProperty(nestedProperty: CreatePropertyDto) {
    const { key, type, fakerType, overrideValue } = nestedProperty;
    return key
      ? {
          [key]: MockApiCreatorService.generateValueByType(
            type,
            fakerType,
            overrideValue
          ),
        }
      : MockApiCreatorService.generateValueByType(
          type,
          fakerType,
          overrideValue
        );
  }

  static initSchemaIfNotExist(mockApiJSON: any, endpoint: string) {
    if (!mockApiJSON.paths[endpoint]) {
      mockApiJSON.paths[endpoint] = {};
    }
    if (!mockApiJSON.responses[endpoint]) {
      mockApiJSON.responses[endpoint] = {};
    }
  }

  public createMockApi(dto: CreateMockApiDto) {
    const { method, body, endpoint, response } = dto;
    const mockEndpoint = `/mocks${endpoint}`;
    const { pathObject, schemaObject } = this.swaggerService.buildSwaggerSpec({
      method,
      endpoint: mockEndpoint,
      body,
    });

    const data: UpdateMockApiJson = {
      method,
      endpoint: mockEndpoint,
      pathObject,
      schemaObject,
    };
    if (response.length) {
      data.responses = this.generateResponse(dto.response);
    }
    return this.updateMockApiJSON(data);
  }

  private generateData(properties: CreatePropertyDto[]) {
    const responses: any = {};
    for (const property of properties) {
      const { key, type, fakerType, overrideValue, items } = property;

      if (isArrayOfObjectType(type)) {
        responses[key] = this.generateData(items);
      }

      if (isArrayOfPrimitiveType(type)) {
        responses[key] = items.map((nestedProperty) =>
          MockApiCreatorService.generateNestedProperty(nestedProperty)
        );
      }

      if (isObjectType(type)) {
        responses[key] = this.generateData(items);
      }

      if (isPrimitive(type)) {
        responses[key] = MockApiCreatorService.generateValueByType(
          type,
          fakerType,
          overrideValue
        );
      }

      if (isEnumType(type)) {
        const enumValues = map(items, "key");
        const randomEnumValue =
          enumValues[Math.floor(Math.random() * enumValues.length)];
        responses[key] = randomEnumValue;
      }
    }
    return responses;
  }

  private generateResponse(
    properties: CreatePropertyDto[],
    times: number = this.options.maximumRandomResponse
  ) {
    const responses = [];
    for (let i = 0; i <= times; i++) {
      responses.push(this.generateData(properties));
    }
    return responses;
  }

  private parseMockApiJsonFile() {
    return JSON.parse(readFileSync(this.options.path, { encoding: "utf-8" }));
  }

  private saveMockApiJSON(mockApiJSON) {
    writeFileSync(this.options.path, JSON.stringify(mockApiJSON));
  }

  private updateMockApiJSON({
    method,
    endpoint,
    pathObject,
    schemaObject,
    responses,
  }: UpdateMockApiJson) {
    const mockApiJSON = this.parseMockApiJsonFile();
    MockApiCreatorService.initSchemaIfNotExist(mockApiJSON, endpoint);

    const lowerMethod = method.toLowerCase();
    mockApiJSON.paths[endpoint][lowerMethod] =
      pathObject[endpoint][lowerMethod];
    if (schemaObject) {
      mockApiJSON.components.schemas[schemaObject.key] = schemaObject.value;
    }
    if (responses) {
      mockApiJSON.responses[endpoint][lowerMethod] = responses;
    }
    this.saveMockApiJSON(mockApiJSON);
    return 1;
  }
}
