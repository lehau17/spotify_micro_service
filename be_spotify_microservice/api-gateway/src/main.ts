import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { HttpExceptionFilter } from './common/filters/HttpException';
import { TransformInterceptor } from './common/interceptors/handler_response';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Chuyển đổi dữ liệu vào DTO
      whitelist: true, // Loại bỏ các thuộc tính không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu có thuộc tính không hợp lệ
    }),
  );

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
  SwaggerModule.setup('', app, document);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
  app.use(helmet());
  app.use(compression());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
