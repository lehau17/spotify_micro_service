import { Module } from '@nestjs/common';
import { GerneService } from './gerne.service';
import { GerneController } from './gerne.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GERNE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@localhost:5672'],
          queue: 'gerne_queue',
          queueOptions: {
            durable: true,
          },
          persistent: false,
        },
      },
    ]),
  ],
  controllers: [GerneController],
  providers: [GerneService],
})
export class GerneModule {}
