import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UpdateService } from './update.service';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUpdateDto } from './dto/update-update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('upload')
@ApiTags('upload') // Gắn tag cho nhóm API
@ApiBearerAuth('access_token')
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}

  @Post()
  create(@Body() createUpdateDto: CreateUpdateDto) {
    return this.updateService.create(createUpdateDto);
  }

  @Post('mp3')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload MP3 file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'MP3 file upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadMp3(@UploadedFile() file: Express.Multer.File) {
    const result = await this.updateService.uploadFile(file);
    return result;
  }

  @Post('uploadS3')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload photo file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'MP3 file upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFileUsingS3(@UploadedFile() file: Express.Multer.File) {
    const fileData = {
      ...file,
      buffer: file.buffer.toString('base64'), // Encode buffer to base64
    };

    return this.updateService.uploadUsingS3(fileData);
  }

  @Get()
  findAll() {
    return this.updateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.updateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUpdateDto: UpdateUpdateDto) {
    return this.updateService.update(+id, updateUpdateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.updateService.remove(+id);
  }
}
