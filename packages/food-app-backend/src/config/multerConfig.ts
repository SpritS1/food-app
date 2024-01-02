import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

export const multerOptions: MulterOptions = {
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
  storage: diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    filename: (req, file, callback) => {
      const fileName = generateFileName(file.originalname);
      callback(null, fileName);
    },
  }),
};

const generateFileName = (originalname: string) => {
  const fileExtention = path.extname(originalname);
  return `${uuid()}${fileExtention}`;
};
