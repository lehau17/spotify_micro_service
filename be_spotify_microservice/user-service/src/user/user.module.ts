import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: 'MAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'mail_queue',
          queueOptions: {
            durable: true,
          },
          persistent: true,
        },
      },
      {
        name: 'SONG_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'song_queue',
          queueOptions: {
            durable: true,
          },
          persistent: false,
        },
      },
      {
        name: 'FOLLOWING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'following_queue',
          queueOptions: {
            durable: true,
          },
          persistent: false,
        },
      },
      {
        name: 'LISTFRIEND_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'list_friend_queue',
          queueOptions: {
            durable: true,
          },
          persistent: false,
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    JwtService,
    ConfigService,
    CacheService,
  ],
})
export class UserModule {}
