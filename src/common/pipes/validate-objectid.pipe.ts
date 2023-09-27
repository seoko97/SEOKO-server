import { Injectable, PipeTransform } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";

import { Types } from "mongoose";

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform {
  async transform(value: string) {
    const isValid = Types.ObjectId.isValid(value);

    if (!isValid) {
      throw new BadRequestException("올바른 형식의 ID가 아닙니다.");
    }

    return value;
  }
}
