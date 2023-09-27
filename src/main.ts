import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import * as cookieParser from "cookie-parser";

import { AppModule } from "@/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  const configService = app.get(ConfigService);

  const PORT = configService.get("PORT");
  const HOST = configService.get("HOST");

  app.use(cookieParser());
  app.enableCors({
    origin: HOST,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(PORT);
}

bootstrap();
