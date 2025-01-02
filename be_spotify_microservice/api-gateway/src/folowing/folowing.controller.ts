import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FolowingService } from './folowing.service';
import { UpdateFolowingDto } from './dto/update-folowing.dto';
import { CreateFollowingDto } from './dto/create-folowing.dto';
import express from 'express';
import { TokenPayload } from 'src/common/types/jwt.type';
@Controller('folowing')
export class FolowingController {
  constructor(private readonly folowingService: FolowingService) {}

  @Post()
  create(
    @Body() createFolowingDto: CreateFollowingDto,
    @Req() req: express.Request,
  ) {
    const { id } = req.user as TokenPayload;
    return this.folowingService.create(createFolowingDto, id);
  }

  @Get()
  findAll() {
    return this.folowingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.folowingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFolowingDto: UpdateFolowingDto,
  ) {
    return this.folowingService.update(+id, updateFolowingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.folowingService.remove(+id);
  }
}
