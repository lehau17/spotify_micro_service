import { Module } from '@nestjs/common';
import { LikeSongService } from './like-song.service';
import { LikeSongController } from './like-song.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'LIKESONG_SERVICE',
        inject: [ConfigService], // Tiêm ConfigService
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') || 'amqp://localhost',
            ],
            queue: 'like_song_queue',
            queueOptions: {
              durable: true,
            },
            persistent: false,
          },
        }),
      },
    ]),
  ],
  controllers: [LikeSongController],
  providers: [LikeSongService],
})
export class LikeSongModule {}
