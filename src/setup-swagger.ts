import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle("Ignite Backend API")
    .setDescription("Ignite Backend API")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup("api/swagger", app, document);
}
