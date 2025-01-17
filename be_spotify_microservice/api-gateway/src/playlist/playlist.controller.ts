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
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto, SongDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { TokenPayload } from 'src/common/types/jwt.type';
import { PagingDto } from 'src/common/paging/paging.dto';
import { ApiProperty, ApiQuery, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AddSongDto } from './dto/add-song.dto';

@Controller('playlist')
@ApiBearerAuth('access_token')
@ApiTags('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  create(
    @Body() createPlaylistDto: CreatePlaylistDto,
    @Req() req: Express.Request,
  ) {
    const { id: user_id } = req.user as TokenPayload;
    return this.playlistService.create(createPlaylistDto, user_id);
  }

  // @Get('me')
  // @ApiQuery({
  //   name: 'limit',
  //   required: false,
  //   type: Number,
  //   description: 'Limit for pagination',
  //   example: 20,
  // })
  // @ApiQuery({
  //   name: 'page',
  //   required: false,
  //   type: Number,
  //   description: 'Page number for pagination',
  //   example: 1,
  // })
  // @ApiQuery({
  //   name: 'cursor',
  //   required: false,
  //   type: Number,
  //   description: 'Cursor for pagination',
  // })
  // getPlaylistMe(@Req() req: Express.Request, @Query() paging: PagingDto) {
  //   const { id } = req.user as TokenPayload;
  //   return this.playlistService.findAll(paging, id);
  // }

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
  findAll(@Query() paging: PagingDto, @Req() req: Express.Request) {
    const { id } = req.user as TokenPayload;
    return this.playlistService.findAll(paging, +id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('check id: ' + id);
    return this.playlistService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistService.update(+id, updatePlaylistDto);
  }

  @Patch(':id/add-songs')
  addSongToPlayList(
    @Param('id') id: string,
    @Body() song: AddSongDto,
    @Req() req: Express.Request,
  ) {
    const { id: user_id } = req.user as TokenPayload;
    return this.playlistService.addSongToPlaylist({
      song_ids: song.song_ids,
      id: +id,
      user_id,
    });
  }

  @Patch(':id/remove-songs')
  @ApiProperty({ description: 'song id', required: true, example: 1 })
  removeSongToPlayList(
    @Param('id') id: string,
    @Body() song_id: number,
    @Req() req: Express.Request,
  ) {
    const { id: user_id } = req.user as TokenPayload;
    return this.playlistService.removeSongToPlaylist({
      song_id,
      playlist_id: +id,
      user_id,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Express.Request) {
    const { id: user_id } = req.user as TokenPayload;
    return this.playlistService.remove(+id, user_id);
  }
}
