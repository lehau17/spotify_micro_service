import { Module } from '@nestjs/common';
import { GerneService } from './gerne.service';
import { GerneController } from './gerne.controller';

@Module({
  controllers: [GerneController],
  providers: [GerneService],
})
export class GerneModule {}
