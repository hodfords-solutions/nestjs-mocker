import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestMethodEnum } from '~mocks/enums/request-method.enum';

export const CustomRequest = createParamDecorator((pathParams, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
        endpoint: request.url,
        method: request.method.toLowerCase()
    };
});

export interface CustomRequest {
    endpoint: string;
    method: RequestMethodEnum;
}
