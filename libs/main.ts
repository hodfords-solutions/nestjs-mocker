import hbs from "hbs";
import { join } from "path";
import { NestFactory } from "@nestjs/core";
import { MockModule } from "~mock.module";
import { NestExpressApplication } from "@nestjs/platform-express";

async function boostrap() {
  const app = await NestFactory.create<NestExpressApplication>(MockModule);
  app.useStaticAssets(join(__dirname, "static"));
  app.setBaseViewsDir(join(__dirname, "views"));
  app.setViewEngine("hbs");
  hbs.registerHelper("json", (obj) => new hbs.SafeString(JSON.stringify(obj)));
}

boostrap();
