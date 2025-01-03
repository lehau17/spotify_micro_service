import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecentSongNoSpecService } from './recent-song--no-spec.service';
import { CreateRecentSongNoSpecDto } from './dto/create-recent-song--no-spec.dto';
import { UpdateRecentSongNoSpecDto } from './dto/update-recent-song--no-spec.dto';

@Controller('recent-song--no-spec')
export class RecentSongNoSpecController {
  constructor(private readonly recentSongNoSpecService: RecentSongNoSpecService) {}

  @Post()
  create(@Body() createRecentSongNoSpecDto: CreateRecentSongNoSpecDto) {
    return this.recentSongNoSpecService.create(createRecentSongNoSpecDto);
  }

  @Get()
  findAll() {
    return this.recentSongNoSpecService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recentSongNoSpecService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecentSongNoSpecDto: UpdateRecentSongNoSpecDto) {
    return this.recentSongNoSpecService.update(+id, updateRecentSongNoSpecDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recentSongNoSpecService.remove(+id);
  }
}
