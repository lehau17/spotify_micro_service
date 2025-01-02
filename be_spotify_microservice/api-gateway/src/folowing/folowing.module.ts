import { Module } from '@nestjs/common';
import { FolowingService } from './folowing.service';
import { FolowingController } from './folowing.controller';

@Module({
  controllers: [FolowingController],
  providers: [FolowingService],
})
export class FolowingModule {}
