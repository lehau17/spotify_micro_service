import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABIITMQ_PORT || 5672}`,
        ],
        queue: 'gerne_queue',
        queueOptions: {
          durable: false,
        },
        persistent: true,
      },
    },
  );
  await app.listen();
}
bootstrap();
