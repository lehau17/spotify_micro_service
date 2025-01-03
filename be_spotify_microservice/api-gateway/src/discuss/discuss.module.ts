import { Module } from '@nestjs/common';
import { DiscussService } from './discuss.service';
import { DiscussController } from './discuss.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DISCUSS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@localhost:5672'],
          queue: 'discuss_queue',
          queueOptions: {
            durable: true,
          },
          persistent: false,
        },
      },
    ]),
  ],
  controllers: [DiscussController],
  providers: [DiscussService],
})
export class DiscussModule {}
