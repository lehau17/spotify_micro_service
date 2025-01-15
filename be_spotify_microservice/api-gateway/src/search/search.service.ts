import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PagingDto } from 'src/common/paging/paging.dto';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { SearchSongDto } from './dto/search-song.dto';

@Injectable()
export class SearchService implements OnModuleInit {
  constructor(
    @Inject('SEARCH_SERVICE') private readonly searchService: ClientProxy,
  ) {}
  onModuleInit() {
    // console.log('onModuleInit', this.searchService);
  }

  searchSong(paging: SearchSongDto) {
    // console.log('check pattern', 'search-song');
    return lastValueFrom(
      this.searchService
        .send('search-song', paging)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  searchSinger(paging: SearchSongDto) {
    // console.log('check pattern', 'search-song');
    return lastValueFrom(
      this.searchService
        .send('search-singer', paging)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  test() {
    return lastValueFrom(
      this.searchService.send('test', '').pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
