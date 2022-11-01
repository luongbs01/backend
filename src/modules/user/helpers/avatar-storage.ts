import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { BadRequestException } from '@nestjs/common';

export const avatarStorageOptions = {
  storage: diskStorage({
    destination: './uploads/avatars/original/',
    filename: (request, file, callback) => {
      if (!file.mimetype.includes('image')) {
        return callback(
          new BadRequestException('Please provide a valid image'),
          null,
        );
      }

      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      callback(null, `${filename}${extension}`);
    },
  }),
  limits: {
    fileSize: Math.pow(1024, 2) * 2,
  },
};
