import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "@/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  const configService = app.get(ConfigService);

  const PORT = configService.get("PORT");
  const HOST = configService.get("HOST");

  app.enableCors({
    origin: HOST,
    credentials: true,
  });

  await app.listen(PORT);
}
bootstrap();
