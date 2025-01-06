import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { LikeSongService } from './like-song.service';
import { CreateLikeSongDto } from './dto/create-like-song.dto';
import { UpdateLikeSongDto } from './dto/update-like-song.dto';
import { TokenPayload } from 'src/common/types/jwt.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
  findAll() {
    return this.likeSongService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likeSongService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLikeSongDto: UpdateLikeSongDto,
  ) {
    return this.likeSongService.update(+id, updateLikeSongDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likeSongService.remove(+id);
  }
}
