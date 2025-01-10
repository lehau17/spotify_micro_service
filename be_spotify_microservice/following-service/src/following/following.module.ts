import { Module } from '@nestjs/common';
import { FollowingService } from './following.service';
import { FollowingController } from './following.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: 'user_queue',
            queueOptions: {
              durable: true,
            },
            persistent: false,
          },
        }),
        inject: [ConfigService], // Inject ConfigService here
      },
    ]),
  ],
  controllers: [FollowingController],
  providers: [FollowingService, PrismaService],
})
export class FollowingModule {}
