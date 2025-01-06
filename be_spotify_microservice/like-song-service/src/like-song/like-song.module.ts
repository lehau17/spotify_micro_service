import { Module } from '@nestjs/common';
import { LikeSongService } from './like-song.service';
import { LikeSongController } from './like-song.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SONG_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@localhost:5672'],
          queue: 'song_queue',
          queueOptions: {
            durable: true,
          },
          persistent: false,
        },
      },
    ]),
  ],
  controllers: [LikeSongController],
  providers: [LikeSongService, PrismaService],
})
export class LikeSongModule {}
