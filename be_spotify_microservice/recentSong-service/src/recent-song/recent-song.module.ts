import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigService
import { RecentSongService } from './recent-song.service';
import { RecentSongController } from './recent-song.controller';

@Module({
  imports: [
    ConfigModule,
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
  controllers: [RecentSongController],
  providers: [RecentSongService],
})
export class RecentSongModule {}
