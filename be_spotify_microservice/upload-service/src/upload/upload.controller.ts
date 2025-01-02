import { ConfigService } from '@nestjs/config';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import * as fs from 'fs';
import slugify from 'slugify';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { UploadService } from './upload.service';

@Controller()
export class UploadController {
  private s3: S3Client;
  private url_cloudfront: string;

  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {
    this.url_cloudfront = configService.get<string>('AWS_CLOUD_FRONT');
    this.s3 = new S3Client({
      region: 'ap-southeast-1',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_S3_SECRET_KEY'),
      },
    });
  }

  @MessagePattern('uploadFileS3')
  async handleFileUploadUsingS3(@Payload() file: any) {
    const { originalname } = file;

    return await this.s3_upload(
      Buffer.from(file.buffer, 'base64'),
      this.configService.get<string>('AWS_S3_NAME'),
      originalname,
      file.mimetype,
    );
  }
  @MessagePattern('mp3')
  async uploadMp3(@Payload() buffer: Express.Multer.File) {
    const result = await this.uploadService.uploadFile(buffer);
    return result.secure_url;
  }

  @MessagePattern('uploadFile')
  async handleFileUpload(@Payload() fileData: any) {
    const { originalname, buffer } = fileData;

    const fileBuffer = Buffer.from(buffer, 'base64');

    const folderPath = './uploads';
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const filePath = `${folderPath}/${Date.now()}-${slugify(originalname)}`;
    fs.writeFileSync(filePath, fileBuffer);

    return filePath;
  }

  async s3_upload(file, bucket, name, mimetype) {
    const key = new Date().getTime() + slugify(name);
    const params = {
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: mimetype,
    };

    try {
      const command = new PutObjectCommand(params);
      await this.s3.send(command);
      return this.url_cloudfront + '/' + key;
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
