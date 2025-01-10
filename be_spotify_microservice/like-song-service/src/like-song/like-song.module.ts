import { Module } from '@nestjs/common';
import { LikeSongService } from './like-song.service';
import { LikeSongController } from './like-song.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CacheService } from 'src/cache/cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Assuming you are using the ConfigService for environment variables

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'SONG_SERVICE',
        inject: [ConfigService], // Inject ConfigService to use environment variables
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
  controllers: [LikeSongController],
  providers: [LikeSongService, PrismaService, CacheService],
})
export class LikeSongModule {}
