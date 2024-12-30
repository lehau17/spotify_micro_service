import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExecutionContext, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { HttpExceptionFilter } from './common/filters/HttpException';
import { TransformInterceptor } from './common/interceptors/handler_response';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalRateLimitInterceptor } from './common/interceptors/ThrottlerInterceptor';
import { RedisThrottlerStorageService } from './RedisThrottlerStorage/throttler-redis.service';
import { ConfigService } from '@nestjs/config';
import { GlobalThrottlerGuard } from './common/guards/global.rate_limit.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Chuyển đổi dữ liệu vào DTO
      whitelist: true, // Loại bỏ các thuộc tính không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu có thuộc tính không hợp lệ
    }),
  );
  app.enableCors();

  // global rate limit
  // app.useGlobalGuards(
  //   new GlobalThrottlerGuard(
  //     {
  //       throttlers: [
  //         {
  //           limit: 5,
  //           ttl: 60,
  //           name: 'rate-limit:global',
  //           getTracker: (req: Record<string, any>, context: ExecutionContext) =>
  //             'rate-limit:global',
  //         },
  //       ],
  //     },
  //     new RedisThrottlerStorageService(),
  //     new Reflector(),
  //   ),
  // );

  const swagger = new DocumentBuilder()
    .setTitle('Spotify API Documentation')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'token',
      },
      'access_token',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api', app, document);
  app.use(helmet(), compression());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    // new GlobalRateLimitInterceptor(
    //   new ConfigService(),
    //   new RedisThrottlerStorageService(),
    // ),
    new TransformInterceptor(new Reflector()),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
