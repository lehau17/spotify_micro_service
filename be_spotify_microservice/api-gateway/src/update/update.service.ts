import { Inject, Injectable } from '@nestjs/common';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUpdateDto } from './dto/update-update.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';

@Injectable()
export class UpdateService {
  constructor(@Inject('UPLOAD_SERVICE') private uploadService: ClientProxy) {}
  create(createUpdateDto: CreateUpdateDto) {
    return 'This action adds a new update';
  }

  async uploadFile(file: Express.Multer.File) {
    const value = await lastValueFrom(
      this.uploadService
        .send('mp3', file)
        .pipe(handleRetryWithBackoff(3, 5000)),
    );
    return value;
  }

  uploadUsingS3(file: any) {
    return lastValueFrom(
      this.uploadService
        .send('uploadFileS3', file)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findAll() {
    return `This action returns all update`;
  }

  findOne(id: number) {
    return `This action returns a #${id} update`;
  }

  update(id: number, updateUpdateDto: UpdateUpdateDto) {
    return `This action updates a #${id} update`;
  }

  remove(id: number) {
    return `This action removes a #${id} update`;
  }
}
