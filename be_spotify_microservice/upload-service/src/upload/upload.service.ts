import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(@Inject('CLOUDINARY') private cloudService: typeof cloudinary) {}

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      this.cloudService.uploader.upload(
        file.path,
        {
          resource_type: 'video', // Xác định loại tệp là video (dùng cho MP3)
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
  }
}
