import { Module } from '@nestjs/common';
import { GerneService } from './gerne.service';
import { GerneController } from './gerne.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'GERNE_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: 'gerne_queue',
            queueOptions: {
              durable: false,
            },
            persistent: true,
          },
        }),
      },
    ]),
  ],
  controllers: [GerneController],
  providers: [GerneService],
})
export class GerneModule {}
