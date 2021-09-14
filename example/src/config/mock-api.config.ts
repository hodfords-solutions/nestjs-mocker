import { MockModule } from '../../../dist/index';
import { env } from '~config/env.config';

export const mockApiConfig = MockModule.forRoot(env.MOCK_API);
