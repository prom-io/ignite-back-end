import {config} from "dotenv";
config();

import {NestFactory} from "@nestjs/core";
import {ValidationPipe} from "@nestjs/common";
import bodyParser from "body-parser";
import {AppModule} from "./AppModule";
import {config as envConfig} from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({limit: Infinity}));
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  app.enableCors();
  await app.listen(envConfig.DATA_VALIDATOR_API_PORT);
}

bootstrap();
