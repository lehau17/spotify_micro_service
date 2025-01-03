import { Module } from '@nestjs/common';
import { RecentSongService } from './recent-song.service';
import { RecentSongController } from './recent-song.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RECENT_SONG_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://admin:1234@localhost:5672',
          ],
          queue: 'recent_song_queue',
          queueOptions: {
            durable: true,
          },
          persistent: false,
        },
      },
    ]),
  ],
  controllers: [RecentSongController],
  providers: [RecentSongService],
})
export class RecentSongModule {}
