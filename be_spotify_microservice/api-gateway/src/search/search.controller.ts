import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { PagingDto } from 'src/common/paging/paging.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Public } from 'src/common/demos/public.deco';
import { SearchSongDto } from './dto/search-song.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get('song')
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
  @ApiQuery({
    name: 'text',
    required: false,
    type: String,
    description: 'text for search',
  })
  searchSong(@Query() paging: SearchSongDto) {
    return this.searchService.searchSong(paging);
  }

  @Public()
  @Get('singer')
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
  @ApiQuery({
    name: 'text',
    required: false,
    type: String,
    description: 'text for search',
  })
  searchSinger(@Query() paging: SearchSongDto) {
    return this.searchService.searchSinger(paging);
  }

  @Get()
  @Public()
  test() {
    return this.searchService.test();
  }
}
