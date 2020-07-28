import {config} from "dotenv";

config();

import {NestFactory} from "@nestjs/core";
import {ValidationPipe} from "@nestjs/common";
import bodyParser from "body-parser";
import {AppModule} from "./AppModule";
import {config as envConfig} from "./config";
import { MediaAttachmentsService } from "./media-attachments/MediaAttachmentsService";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(bodyParser.json({limit: Infinity}));
    app.useGlobalPipes(new ValidationPipe({transform: true}));
    app.enableCors();
    await app.listen(envConfig.IGNITE_API_PORT);

    // you can remove this after the first run
    const mediaAttachmentsService = app.get(MediaAttachmentsService)
    await mediaAttachmentsService.generatePreviewsForExistingMediaAttachments()
}

bootstrap();
