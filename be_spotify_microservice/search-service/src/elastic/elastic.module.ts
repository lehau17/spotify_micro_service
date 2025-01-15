import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import SearchController from './elastic.controller';
import SongSearchService from './song-search.service';
import SingerSearchService from './singer-search.service';
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTIC_NODE') || 'http://localhost:9200',
        requestTimeout: 30000,
        maxRetries: 3,
        auth: {
          username: configService.get('ELASTIC_USER') || 'elastic',
          password: configService.get('ELASTIC_PASS') || '3881016Hau',
        },
        tls: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SongSearchService, SingerSearchService, SearchController],
  exports: [SongSearchService, SingerSearchService],
})
export class ElasticModule {}
