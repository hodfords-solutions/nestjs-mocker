import { join } from 'path';
import { MockApiModule } from '../../../libs';

export const mockApiConfig = MockApiModule.forRoot({
    path: join(__dirname, 'static/mock-api.json'),
    maximumRandomResponse: 5
});
