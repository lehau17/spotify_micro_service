import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prima.module';
import { PrismaService } from './prisma/prisma.service';
import { CacheModule } from './cache/cache.module';
import { CacheService } from './cache/cache.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    CacheModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, CacheService],
})
export class AppModule {}
