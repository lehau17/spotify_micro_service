import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DiscussService } from './discuss.service';
import { CreateDiscussDto } from './dto/create-discuss.dto';
import { UpdateDiscussDto } from './dto/update-discuss.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('discuss')
@ApiBearerAuth('access_token')
@Controller('discuss')
export class DiscussController {
  constructor(private readonly discussService: DiscussService) {}

  @Post()
  create(@Body() createDiscussDto: CreateDiscussDto) {
    return this.discussService.create(createDiscussDto);
  }

  @Get()
  findAll() {
    return this.discussService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discussService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscussDto: UpdateDiscussDto) {
    return this.discussService.update(+id, updateDiscussDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discussService.remove(+id);
  }
}
