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
          urls: ['amqp://admin:1234@localhost:5672'],
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
