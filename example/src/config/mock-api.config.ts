import { env } from '~config/env.config';
import { MockModule } from "../../../dist";

export const mockApiConfig = MockModule.forRoot(env.MOCK_API);
