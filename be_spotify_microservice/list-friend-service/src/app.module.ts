import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ListFriendController } from './list-friend/list-friend.controller';
import { ListFriendModule } from './list-friend/list-friend.module';
import { PrismaModule } from './prisma/prima.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ListFriendService } from './list-friend/list-friend.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
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
    ListFriendModule,
    PrismaModule,
  ],
  controllers: [ListFriendController],
  providers: [PrismaService, ListFriendService],
})
export class AppModule {}
