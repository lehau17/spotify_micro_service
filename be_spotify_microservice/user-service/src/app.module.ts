import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prima.module';
import { PrismaService } from './prisma/prisma.service';
import { CacheModule } from './cache/cache.module';
import { CacheService } from './cache/cache.service';

@Module({
  imports: [UserModule, PrismaModule, CacheModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, CacheService],
})
export class AppModule {}
