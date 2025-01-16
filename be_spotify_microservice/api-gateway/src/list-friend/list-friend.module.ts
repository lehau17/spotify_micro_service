import { Module } from '@nestjs/common';
import { ListFriendService } from './list-friend.service';
import { ListFriendController } from './list-friend.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'LISTFRIEND_SERVICE',
        inject: [ConfigService], // Tiêm ConfigService
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') || 'amqp://localhost',
            ],
            queue: 'list_friend_queue',
            queueOptions: {
              durable: true,
            },
            persistent: false,
          },
        }),
      },
    ]),
  ],
  controllers: [ListFriendController],
  providers: [ListFriendService],
})
export class ListFriendModule {}
