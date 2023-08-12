import { Controller, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { ValidationImageParamPipe } from "@/common/pipes/upload-image.pipe";
import { ImageService } from "@/routes/image/image.service";
import { TImageType } from "@/types";

@Controller("images")
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post(":type")
  @UseInterceptors(FileInterceptor("image"))
  async upload(
    @Param("type", ValidationImageParamPipe) type: TImageType,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imageService.addImage(type, file);
  }
}
