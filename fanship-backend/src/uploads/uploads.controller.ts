import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { File as MulterFile } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB 제한
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error('지원하지 않는 파일 형식입니다.'), false);
      }
      cb(null, true);
    },
  }))
  uploadFile(@UploadedFile() file: MulterFile) {
    return { url: `/uploads/${file.filename}` };
  }
}
