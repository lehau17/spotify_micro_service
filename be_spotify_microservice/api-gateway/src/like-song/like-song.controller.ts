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
import { LikeSongService } from './like-song.service';
import { CreateLikeSongDto } from './dto/create-like-song.dto';
import { UpdateLikeSongDto } from './dto/update-like-song.dto';
import { TokenPayload } from 'src/common/types/jwt.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PagingDto } from 'src/common/paging/paging.dto';

@Controller('like-song')
@ApiTags('like-song')
@ApiBearerAuth('access_token')
export class LikeSongController {
  constructor(private readonly likeSongService: LikeSongService) {}

  @Post()
  create(
    @Body() createLikeSongDto: CreateLikeSongDto,
    @Req() req: Express.Request,
  ) {
    const { id, name, url } = req.user as TokenPayload;
    return this.likeSongService.create(createLikeSongDto, { id, name, url });
  }

  @Get()
  findAll(@Query() paging: PagingDto) {
    return this.likeSongService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likeSongService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Express.Request) {
    const { id: user_id } = req.user as TokenPayload;
    return this.likeSongService.remove({ id: +id, user_id });
  }
}
