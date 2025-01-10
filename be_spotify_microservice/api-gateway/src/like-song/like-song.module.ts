import { Module } from '@nestjs/common';
import { LikeSongService } from './like-song.service';
import { LikeSongController } from './like-song.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'LIKESONG_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'like_song_queue',
          queueOptions: {
            durable: true,
          },
          persistent: false,
        },
      },
    ]),
  ],
  controllers: [LikeSongController],
  providers: [LikeSongService],
})
export class LikeSongModule {}
