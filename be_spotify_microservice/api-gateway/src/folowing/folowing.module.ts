import { Module } from '@nestjs/common';
import { FolowingService } from './folowing.service';
import { FolowingController } from './folowing.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
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
    ]),
  ],
  controllers: [FolowingController],
  providers: [FolowingService],
})
export class FolowingModule {}
