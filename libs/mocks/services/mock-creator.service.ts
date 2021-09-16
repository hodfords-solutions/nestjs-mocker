import { Inject, Injectable } from '@nestjs/common';
import * as faker from 'faker';
import { v4 as uuidv4 } from 'uuid';

import { readFileSync, writeFileSync } from 'fs';
import { map } from 'lodash';
import { getMetadataArgsStorage } from 'typeorm';
import { CONFIG_OPTIONS } from '../constants/config-options.constant';
import { MockOptions } from '../interfaces/mock-options.interface';
import { SwaggerService } from './swagger.service';
import { ColumnMetaArgs } from '../interfaces/column-meta-args.interface';
import { TypeSelectionEnum } from '../enums/type-selection.enum';
import { FakerType } from '../interfaces/faker-type.interface';
import { CreateMockApiDto } from '../dtos/create-mock-api.dto';
import { UpdateMockApiJson } from '../interfaces/update-mock-api-json.interface';
import { CreatePropertyDto } from '../dtos/create-property.dto';
import {
    isArrayOfObjectType,
    isArrayOfPrimitiveType,
    isEnumType,
    isObjectType,
    isPrimitive
} from '../helpers/check-type.helper';

@Injectable()
export class MockCreatorService {
    constructor(@Inject(CONFIG_OPTIONS) private options: MockOptions, private swaggerService: SwaggerService) {}

    static listFakerMethods() {
        const fakerMethods = [
            'address',
            'commerce',
            'company',
            'database',
            'datatype',
            'date',
            'finance',
            'git',
            'hacker',
            'helpers',
            'image',
            'internet',
            'lorem',
            'name',
            'music',
            'phone',
            'random',
            'system',
            'time',
            'vehicle'
        ];
        return fakerMethods.map((category) => ({
            category,
            methods: Object.keys(faker[category])
        }));
    }

    static getCurrentEntities(excludes: string[] = []): Record<string, ColumnMetaArgs[]> {
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
            options: { type, nullable }
        } of columns) {
            const columnData = {
                key: propertyName,
                type,
                isRequired: !nullable
            };

            const table = Object.getOwnPropertyDescriptor(target, 'name').value.replace('Entity', '');
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
                  [key]: MockCreatorService.generateValueByType(type, fakerType, overrideValue)
              }
            : MockCreatorService.generateValueByType(type, fakerType, overrideValue);
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
            body
        });

        const data: UpdateMockApiJson = {
            method,
            endpoint: mockEndpoint,
            pathObject,
            schemaObject
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
                    MockCreatorService.generateNestedProperty(nestedProperty)
                );
            }

            if (isObjectType(type)) {
                responses[key] = this.generateData(items);
            }

            if (isPrimitive(type)) {
                responses[key] = MockCreatorService.generateValueByType(type, fakerType, overrideValue);
            }

            if (isEnumType(type)) {
                const enumValues = map(items, 'key');
                const randomEnumValue = enumValues[Math.floor(Math.random() * enumValues.length)];
                responses[key] = randomEnumValue;
            }
        }
        return responses;
    }

    private generateResponse(properties: CreatePropertyDto[], times: number = this.options.maximumRandomResponse) {
        const responses = [];
        for (let i = 0; i <= times; i++) {
            responses.push(this.generateData(properties));
        }
        return responses;
    }

    private parseMockApiJsonFile() {
        return JSON.parse(readFileSync(this.options.path, { encoding: 'utf-8' }));
    }

    private saveMockApiJSON(mockApiJSON) {
        writeFileSync(this.options.path, JSON.stringify(mockApiJSON));
    }

    private updateMockApiJSON({ method, endpoint, pathObject, schemaObject, responses }: UpdateMockApiJson) {
        const mockApiJSON = this.parseMockApiJsonFile();
        MockCreatorService.initSchemaIfNotExist(mockApiJSON, endpoint);

        const lowerMethod = method.toLowerCase();
        mockApiJSON.paths[endpoint][lowerMethod] = pathObject[endpoint][lowerMethod];
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
