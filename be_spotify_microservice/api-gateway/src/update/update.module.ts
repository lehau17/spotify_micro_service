import { Module } from '@nestjs/common';
import { UpdateService } from './update.service';
import { UpdateController } from './update.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'UPLOAD_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@localhost:5672'],
          queue: 'upload_queue',
          queueOptions: {
            durable: true,
          },
          persistent: false,
        },
      },
    ]),
  ],
  controllers: [UpdateController],
  providers: [UpdateService],
})
export class UpdateModule {}
