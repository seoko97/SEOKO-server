import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";

import { ImageController } from "@/routes/image/image.controller";
import { ImageService } from "@/routes/image/image.service";
import { multerOptionsFactory } from "@/utils/multerOptionsFactory";

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    MulterModule.registerAsync({
      useFactory: multerOptionsFactory,
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
