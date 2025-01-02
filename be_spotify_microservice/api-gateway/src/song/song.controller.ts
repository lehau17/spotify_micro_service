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
import { SongService } from './song.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/demos/roles.decorator';
import RoleType from 'src/common/types/role.type';
import { TokenPayload } from 'src/common/types/jwt.type';
import { PagingDto } from 'src/common/paging/paging.dto';

@Controller('song')
@ApiTags('song')
@ApiBearerAuth('access_token')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post()
  @Roles([RoleType.USER, RoleType.ADMIN])
  create(@Body() createSongDto: CreateSongDto, @Req() req: Express.Request) {
    const { id } = req.user as TokenPayload;
    return this.songService.create(createSongDto, id);
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
  findAll(@Query() paging: PagingDto) {
    return this.songService.listDeXuatBaiHat(paging);
  }

  @Get('my-song')
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
  listMySong(@Query() paging: PagingDto, @Req() req: Express.Request) {
    const { id } = req.user as TokenPayload;
    return this.songService.listMySong(paging, id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songService.update(+id, updateSongDto);
  }

  @Delete(':id')
  remove(@Param('id') song_id: string, @Req() req: Express.Request) {
    const { id } = req.user as TokenPayload;
    return this.songService.remove(+song_id, +id);
  }
}
