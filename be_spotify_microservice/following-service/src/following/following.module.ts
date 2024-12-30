import { Module } from '@nestjs/common';
import { FollowingService } from './following.service';
import { FollowingController } from './following.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FollowingController],
  providers: [FollowingService, PrismaService],
})
export class FollowingModule {}
