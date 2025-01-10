import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { FolowingService } from './folowing.service';
import { UpdateFolowingDto } from './dto/update-folowing.dto';
import { CreateFollowingDto } from './dto/create-folowing.dto';
import express from 'express';
import { TokenPayload } from 'src/common/types/jwt.type';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PagingDto } from 'src/common/paging/paging.dto';
import { ToggerFollower } from './dto/togge.dto';
@ApiTags('following')
@ApiBearerAuth('access_token')
@Controller('following')
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
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit for pagination',
    example: 20,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: Number,
    description: 'Cursor for pagination',
  })
  findAll(@Query() paging: PagingDto, @Req() req: express.Request) {
    paging.fullFill();
    const { id } = req.user as TokenPayload;
    return this.folowingService.findAll(paging, id);
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
  remove(@Param('id') following_id: string, @Req() req: Express.Request) {
    const { id } = req.user as TokenPayload;
    return this.folowingService.remove(+following_id, id);
  }

  @Post('toogle')
  toogleFollow(@Body() payload: ToggerFollower, @Req() req: Express.Request) {
    const { id } = req.user as TokenPayload;
    return this.folowingService.toggerFollower(id, payload.following_user_id);
  }

  toggerFollower;
}
