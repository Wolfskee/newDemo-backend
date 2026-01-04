import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerImageOptions: MulterOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
};
