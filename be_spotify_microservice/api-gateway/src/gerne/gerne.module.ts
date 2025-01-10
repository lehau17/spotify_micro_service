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
          urls: [process.env.RABBITMQ_URL],
          queue: 'gerne_queue',
          queueOptions: {
            durable: false,
          },
          persistent: true,
        },
      },
    ]),
  ],
  controllers: [GerneController],
  providers: [GerneService],
})
export class GerneModule {}
