import { HttpService, HttpModuleOptions } from "@nestjs/axios";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { firstValueFrom } from "rxjs";

import { TImageType } from "@/types";

@Injectable()
export class ImageService {
  private readonly IMAGE_UPLOAD_URL: string;
  private readonly IMAGE_APP_KEY: string;
  private readonly IMAGE_OPTION: HttpModuleOptions;

  constructor(private readonly httpService: HttpService, configService: ConfigService) {
    this.IMAGE_UPLOAD_URL = configService.get("IMAGE_UPLOAD_URL");
    this.IMAGE_APP_KEY = configService.get("IMAGE_APP_KEY");
    this.IMAGE_OPTION = {
      headers: {
        Authorization: `${configService.get("IMAGE_UPLOAD_SECRET_KEY")}`,
        "Content-Type": "application/octet-stream",
      },
    };
  }

  async addImage(type: TImageType, image: Express.Multer.File) {
    try {
      const { originalname, buffer } = image;

      const imageRes = await firstValueFrom(
        this.httpService.put(
          `${this.IMAGE_UPLOAD_URL}/appkeys/${this.IMAGE_APP_KEY}/images?path=/${type}/${originalname}&overwrite=true`,
          buffer,
          this.IMAGE_OPTION,
        ),
      );

      return this.httpsTransducer(imageRes.data.file.url);
    } catch (error) {
      new BadRequestException(error.message);
    }
  }

  private httpsTransducer(url: string) {
    const protocol = new URL(url).protocol;

    return url.replace(protocol, "https:");
  }
}
