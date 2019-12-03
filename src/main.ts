import {config} from "dotenv";
config();

import {NestFactory} from "@nestjs/core";
import {AppModule} from "./AppModule";
import {config as envConfig} from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(envConfig.PORT);
}
bootstrap();
