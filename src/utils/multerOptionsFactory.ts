import { BadRequestException } from "@nestjs/common";
import { MulterModuleOptions } from "@nestjs/platform-express";

import { IMAGE_ERROR, IMAGE_MIME_TYPES, MAX_FILE_SIZE } from "@/utils/constants";

const multerOptionsFactory = (): MulterModuleOptions => {
  return {
    fileFilter(req, file, callback) {
      const mimeType = file.mimetype as (typeof IMAGE_MIME_TYPES)[number];

      const index = IMAGE_MIME_TYPES.indexOf(mimeType);

      if (index === -1) {
        return callback(new BadRequestException(IMAGE_ERROR.INVALID_TYPE), false);
      }

      callback(null, true);
    },
    limits: { fileSize: MAX_FILE_SIZE },
  };
};

export { multerOptionsFactory };
