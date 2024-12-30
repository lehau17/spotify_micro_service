import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FollowingModule } from './following/following.module';
import { PrismaModule } from './prisma/prima.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [FollowingModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
