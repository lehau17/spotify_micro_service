import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prima.module';
import { PrismaService } from './prisma/prisma.service';
import { DiscussModule } from './discuss/discuss.module';

@Module({
  imports: [PrismaModule, DiscussModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
