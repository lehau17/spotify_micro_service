import { Module } from '@nestjs/common';
import { ListFriendService } from './list-friend.service';
import { ListFriendController } from './list-friend.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        inject: [ConfigService], // Inject ConfigService to use environment variables
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ||
                'amqp://admin:1234@localhost:5672',
            ],
            queue: 'user_queue',
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
  providers: [ListFriendService, PrismaService],
})
export class ListFriendModule {}
