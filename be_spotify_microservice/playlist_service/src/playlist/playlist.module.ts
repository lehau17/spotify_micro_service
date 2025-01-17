import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigService
import PlaylistServiceVer2 from './playlist.ver2.service';
import PlaylistVer2Controller from './playlist.ver2.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'SONG_SERVICE',
        inject: [ConfigService], // Inject ConfigService
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ||
                'amqp://admin:1234@localhost:5672',
            ],
            queue: 'song_queue',
            queueOptions: {
              durable: true,
            },
            persistent: false,
          },
        }),
      },
    ]),
  ],
  controllers: [PlaylistController, PlaylistVer2Controller],
  providers: [PlaylistService, PlaylistServiceVer2],
})
export class PlaylistModule {}
