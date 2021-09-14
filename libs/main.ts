import hbs from "hbs";
import { join } from "path";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { MockModule } from "./mock.module";

async function boostrap() {
  const app = await NestFactory.create<NestExpressApplication>(MockModule);
  app.useStaticAssets(join(__dirname, "static"));
  app.setBaseViewsDir(join(__dirname, "views"));
  app.setViewEngine("hbs");
  hbs.registerHelper("json", (obj) => new hbs.SafeString(JSON.stringify(obj)));
}

boostrap();
