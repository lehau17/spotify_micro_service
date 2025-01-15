import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export default class UserSearchService {
  private index = 'song-index';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async search(text: string) {
    const body = await this.elasticsearchService.search<any>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['firstName', 'lastName', 'email'],
          },
        },
      },
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }
}
