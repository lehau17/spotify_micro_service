import { Module } from '@nestjs/common';
import { UpdateService } from './update.service';
import { UpdateController } from './update.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'UPLOAD_SERVICE',
        inject: [ConfigService], // Tiêm ConfigService
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: 'upload_queue',
            queueOptions: {
              durable: true,
            },
            persistent: false,
          },
        }),
      },
    ]),
  ],
  controllers: [UpdateController],
  providers: [UpdateService],
})
export class UpdateModule {}
