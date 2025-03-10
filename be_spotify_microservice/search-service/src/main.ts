import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: 'search_queue',
        queueOptions: {
          durable: true,
        },
        persistent: false,
      },
    },
  );
  await app.listen();
  // const app = NestFactory.create(AppModule);
  // (await app).listen(4000);
}
bootstrap();
