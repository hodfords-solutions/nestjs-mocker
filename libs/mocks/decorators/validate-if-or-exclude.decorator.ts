import { ValidateIf, ValidationOptions } from 'class-validator';

export const TRANSFORMER_EXCLUDE_KEY = 'transformer:exclude';

export function ValidateIfOrExclude(
    condition: (object: any, value: any) => boolean,
    validationOptions?: ValidationOptions
): PropertyDecorator {
    return function (object, propertyName: string): void {
        const metadatas = Reflect.getMetadata(TRANSFORMER_EXCLUDE_KEY, object.constructor) || [];
        Reflect.defineMetadata(
            TRANSFORMER_EXCLUDE_KEY,
            [...metadatas, { propertyName, condition }],
            object.constructor
        );

        ValidateIf(condition, validationOptions)(object, propertyName);
    };
}
