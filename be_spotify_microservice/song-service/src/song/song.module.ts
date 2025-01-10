import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GERNE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'gerne_queue',
          queueOptions: {
            durable: false,
          },
          persistent: true,
        },
      },
    ]),
  ],
  controllers: [SongController],
  providers: [SongService, CacheService],
})
export class SongModule {}
