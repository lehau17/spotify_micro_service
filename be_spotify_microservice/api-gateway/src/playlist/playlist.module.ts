import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'PLAYLIST_SERVICE',
        inject: [ConfigService], // Tiêm ConfigService
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: 'playlist_queue',
            queueOptions: {
              durable: true,
            },
            persistent: false,
          },
        }),
      },
    ]),
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule {}
