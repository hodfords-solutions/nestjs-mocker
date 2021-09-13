import { RequestMethodEnum } from '~mocks/enums/request-method.enum';

export interface MockApi {
    method: RequestMethodEnum;
    response: any[];
}
