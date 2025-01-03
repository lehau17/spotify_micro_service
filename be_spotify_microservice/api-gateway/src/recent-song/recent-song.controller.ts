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
import { RecentSongService } from './recent-song.service';
import { CreateRecentSongDto } from './dto/create-recent-song.dto';
import { UpdateRecentSongDto } from './dto/update-recent-song.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TokenPayload } from 'src/common/types/jwt.type';
import { PagingDto } from 'src/common/paging/paging.dto';

@Controller('recent-song')
@ApiTags('recent-song')
@ApiBearerAuth('access_token')
export class RecentSongController {
  constructor(private readonly recentSongService: RecentSongService) {}

  @Post()
  create(
    @Body() createRecentSongDto: CreateRecentSongDto,
    @Req() req: Express.Request,
  ) {
    const { id } = req.user as TokenPayload;
    return this.recentSongService.create(createRecentSongDto, id);
  }

  @Get('me')
  findAll(@Query() paging: PagingDto, @Req() req: Express.Request) {
    const { id } = req.user as TokenPayload;
    return this.recentSongService.findAll(paging, id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recentSongService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecentSongDto: UpdateRecentSongDto,
  ) {
    return this.recentSongService.update(+id, updateRecentSongDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Express.Request) {
    const { id: user_id } = req.user as TokenPayload;

    return this.recentSongService.remove(+id, +user_id);
  }
}
