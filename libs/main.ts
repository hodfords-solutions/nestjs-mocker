import hbs from "hbs";
import { join } from "path";
import { NestFactory } from "@nestjs/core";
import { MockApiModule } from "~mocks/mock.module";
import { NestExpressApplication } from "@nestjs/platform-express";

async function boostrap() {
  const app = await NestFactory.create<NestExpressApplication>(MockApiModule);
  app.useStaticAssets(join(__dirname, "static"));
  app.setBaseViewsDir(join(__dirname, "views"));
  app.setViewEngine("hbs");
  hbs.registerHelper("json", (obj) => new hbs.SafeString(JSON.stringify(obj)));
}

boostrap();
