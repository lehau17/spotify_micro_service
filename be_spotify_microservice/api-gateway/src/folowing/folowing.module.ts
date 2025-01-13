import { Module } from '@nestjs/common';
import { FolowingService } from './folowing.service';
import { FolowingController } from './folowing.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'FOLLOWING_SERVICE',
        inject: [ConfigService], // Tiêm ConfigService
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') || 'amqp://localhost',
            ],
            queue: 'following_queue',
            queueOptions: {
              durable: true,
            },
            persistent: false,
          },
        }),
      },
    ]),
  ],
  controllers: [FolowingController],
  providers: [FolowingService],
})
export class FolowingModule {}
