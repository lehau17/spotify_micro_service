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
          urls: [process.env.RABBITMQ_URL],
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
