import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class EnvironmentSwagger {
    constructor(private app) {}

    buildDocument() {
        const mockOptions = new DocumentBuilder()
            .setTitle('Mock API')
            .setDescription('Mock API')
            .setVersion('1.0')
            .build();
        const config = SwaggerModule.createDocument(this.app, mockOptions);

        SwaggerModule.setup('mocks', this.app, config, {
            swaggerUrl: '/mock-api.json',
            swaggerOptions: {
                spec: ''
            }
        });
    }
}
