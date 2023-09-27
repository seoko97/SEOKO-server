import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

import { TImageType } from "@/types";
import { IMAGE_ERROR, IMAGE_UPLOAD_TYPES } from "@/utils/constants";

@Injectable()
export class ValidationImageParamPipe implements PipeTransform {
  transform(value: TImageType) {
    const index = IMAGE_UPLOAD_TYPES.indexOf(value);

    if (index === -1) {
      throw new BadRequestException(IMAGE_ERROR.INVALID_UPLOAD_TYPE);
    }

    return value;
  }
}
