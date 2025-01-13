import { Module } from '@nestjs/common';
import { RecentSongService } from './recent-song.service';
import { RecentSongController } from './recent-song.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'RECENT_SONG_SERVICE',
        inject: [ConfigService], // Tiêm ConfigService
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: 'recent_song_queue',
            queueOptions: {
              durable: true,
            },
            persistent: false,
          },
        }),
      },
    ]),
  ],
  controllers: [RecentSongController],
  providers: [RecentSongService],
})
export class RecentSongModule {}
