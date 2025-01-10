import { Module } from '@nestjs/common';
import { DiscussService } from './discuss.service';
import { DiscussController } from './discuss.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'SONG_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: 'song_queue',
            queueOptions: {
              durable: true,
            },
            persistent: false,
          },
        }),
        inject: [ConfigService], // Inject ConfigService here
      },
    ]),
  ],
  controllers: [DiscussController],
  providers: [DiscussService],
})
export class DiscussModule {}
