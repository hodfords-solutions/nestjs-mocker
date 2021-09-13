import { Injectable } from "@nestjs/common";
import { CreatePropertyDto } from "~mocks/dtos/create-property.dto";
import {
  PathsObject,
  SchemaObject,
} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { TypeSelectionEnum } from "~mocks/enums/type-selection.enum";
import { RequestMethodEnum } from "~mocks/enums/request-method.enum";
import { v4 as uuidv4 } from "uuid";
import {
  isArrayOfObjectType,
  isArrayOfPrimitiveType,
  isEnumType,
  isFakerType,
  isObjectType,
  isUUIDType,
} from "~mocks/helpers/check-type.helper";
import { map } from "lodash";
import { SwaggerSpecResponse } from "~mocks/types/swagger-spec-response.type";
import { FakerType } from "~mocks/interfaces/faker-type.interface";

@Injectable()
export class SwaggerService {
  static mapResponseByMethod(method: RequestMethodEnum) {
    switch (method) {
      case RequestMethodEnum.POST:
        return { "201": { description: "" } };
      case RequestMethodEnum.GET:
      case RequestMethodEnum.PATCH:
      case RequestMethodEnum.PUT:
      case RequestMethodEnum.DELETE:
        return { "200": { description: "" } };
    }
  }

  static splitEndpoint(endpoint: string): { prefix: string; resource: string } {
    const splitEndpoint = endpoint.split("/");
    return {
      prefix: splitEndpoint[1],
      resource: splitEndpoint[2],
    };
  }

  static capitalizeFirstLetter(prefix) {
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }

  static buildDtoObject(method: RequestMethodEnum, resource: string) {
    const requestMethodDtoMapper = {
      [RequestMethodEnum.PUT]: "Update",
      [RequestMethodEnum.PATCH]: "Modifies",
      [RequestMethodEnum.POST]: "Create",
      [RequestMethodEnum.DELETE]: "Delete",
    };
    const capitalizedResource = SwaggerService.capitalizeFirstLetter(resource);
    const standardizedResource = capitalizedResource.slice(
      0,
      capitalizedResource.length - 1
    );
    return `${requestMethodDtoMapper[method]}${standardizedResource}Dto`;
  }

  static maybeHavingRequestBody(method) {
    return (
      method === RequestMethodEnum.POST ||
      method === RequestMethodEnum.PUT ||
      method === RequestMethodEnum.PATCH ||
      method === RequestMethodEnum.DELETE
    );
  }

  static buildPathObject(
    endpoint: string,
    method: RequestMethodEnum,
    body?: CreatePropertyDto[]
  ): PathsObject {
    const { prefix, resource } = SwaggerService.splitEndpoint(endpoint);
    const pathObject: PathsObject = {
      [endpoint]: {
        [method.toLowerCase()]: {
          operationId: uuidv4(),
          summary: "",
          description: "",
          tags: [SwaggerService.capitalizeFirstLetter(prefix)],
          responses: SwaggerService.mapResponseByMethod(method),
        },
      },
    };
    const operationObject = pathObject[endpoint][method.toLowerCase()];
    if (SwaggerService.maybeHavingRequestBody(method)) {
      operationObject.requestBody = body
        ? {
            require: true,
            content: {
              "application/json": {
                schema: {
                  $ref: `#/components/schemas/${SwaggerService.buildDtoObject(
                    method,
                    resource
                  )}`,
                },
              },
            },
          }
        : {};
    }

    return pathObject;
  }

  public buildSwaggerSpec(data: {
    method: RequestMethodEnum;
    endpoint: string;
    body?: CreatePropertyDto[];
  }): SwaggerSpecResponse {
    const { method, endpoint, body } = data;
    const { resource } = SwaggerService.splitEndpoint(endpoint);

    const pathObject = SwaggerService.buildPathObject(endpoint, method, body);
    if (SwaggerService.maybeHavingRequestBody(method) && body) {
      const schemaObject = {
        key: SwaggerService.buildDtoObject(method, resource),
        value: this.buildSchemeObject(body),
      };

      return {
        pathObject,
        schemaObject,
      };
    }

    return {
      pathObject,
    };
  }

  private mapSchemaFakerType(
    schema: SchemaObject,
    fakerType: FakerType
  ): SchemaObject {
    const { category, method } = fakerType;
    schema.type = TypeSelectionEnum.STRING.toLowerCase();
    schema.example = `${category.toUpperCase()}_${method}`;
    return schema;
  }

  private mapSchemaEnumType(
    schema: SchemaObject,
    items: CreatePropertyDto[]
  ): SchemaObject {
    schema.type = TypeSelectionEnum.STRING.toLowerCase();
    schema.enum = map(items, "key");
    return schema;
  }

  private mapSchemaUUIDType(schema: SchemaObject): SchemaObject {
    schema.type = TypeSelectionEnum.STRING.toLowerCase();
    schema.example = uuidv4();
    return schema;
  }

  private mapSchemaObjectType(
    schema: SchemaObject,
    items: CreatePropertyDto[]
  ): SchemaObject {
    schema.type = TypeSelectionEnum.OBJECT.toLowerCase();
    for (const nestedProperty of items) {
      if (!schema.properties) {
        schema.properties = {};
      }
      schema.properties[nestedProperty.key] = this.buildSchema(nestedProperty);
    }
    return schema;
  }

  private mapSchemaArrayOfObjectType(
    schema: SchemaObject,
    items: CreatePropertyDto[]
  ): SchemaObject {
    schema.type = "array";
    for (const nestedProperty of items) {
      if (!schema.items) {
        schema.items = {};
      }
      schema.items[nestedProperty.key] = this.buildSchema(nestedProperty);
    }
    return schema;
  }

  private mapSchemaArrayOfPrimitiveType(
    schema: SchemaObject,
    items: CreatePropertyDto[]
  ): SchemaObject {
    schema.type = "array";
    for (const nestedProperty of items) {
      if (!schema.items) {
        schema.items = {};
      }
      schema.items = { type: nestedProperty.type };
    }
    return schema;
  }

  private buildSchema(property: CreatePropertyDto) {
    const { type, fakerType, overrideValue, defaultValue, items } = property;

    let schema: SchemaObject = { type: type.toLowerCase() };
    if (overrideValue) {
      schema.example = overrideValue;
    }
    if (defaultValue) {
      schema.default = defaultValue;
    }
    if (isArrayOfObjectType(type)) {
      schema = this.mapSchemaArrayOfObjectType(schema, items);
    }
    if (isArrayOfPrimitiveType(type)) {
      schema = this.mapSchemaArrayOfPrimitiveType(schema, items);
    }
    if (isObjectType(type)) {
      schema = this.mapSchemaObjectType(schema, items);
    }
    if (isUUIDType(type)) {
      schema = this.mapSchemaUUIDType(schema);
    }
    if (isFakerType(type)) {
      schema = this.mapSchemaFakerType(schema, fakerType);
    }
    if (isEnumType(type)) {
      schema = this.mapSchemaEnumType(schema, items);
    }
    return schema;
  }

  private buildSchemeObject(properties: CreatePropertyDto[]): SchemaObject {
    const schemas: SchemaObject = {
      type: "object",
      required: [],
      properties: {},
    };
    for (const property of properties) {
      if (property.isRequired) {
        schemas.required.push(property.key);
      }
      schemas.properties[property.key] = this.buildSchema(property);
    }
    return schemas;
  }
}
