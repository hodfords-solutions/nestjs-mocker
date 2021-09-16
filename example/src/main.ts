import { env } from '~config/env.config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { EnvironmentSwagger } from '~swaggers/environment-swagger';
import hbs from 'hbs';

env.ROOT_PATH = __dirname;

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useStaticAssets(join(env.ROOT_PATH, 'static'));
    // app.setBaseViewsDir('../../../dist/views');
    app.setViewEngine('hbs');
    hbs.registerHelper('json', (obj) => new hbs.SafeString(JSON.stringify(obj)));

    new EnvironmentSwagger(app).buildDocument();
    await app.listen(env.APP_PORT);
}

bootstrap();
