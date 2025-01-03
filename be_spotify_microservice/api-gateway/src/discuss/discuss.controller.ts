import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { DiscussService } from './discuss.service';
import { CreateDiscussDto } from './dto/create-discuss.dto';
import { UpdateDiscussDto } from './dto/update-discuss.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TokenPayload } from 'src/common/types/jwt.type';
@ApiTags('discuss')
@ApiBearerAuth('access_token')
@Controller('discuss')
export class DiscussController {
  constructor(private readonly discussService: DiscussService) {}

  @Post()
  create(
    @Body() createDiscussDto: CreateDiscussDto,
    @Req() req: Express.Request,
  ) {
    const { id } = req.user as TokenPayload;
    return this.discussService.create(createDiscussDto, id);
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
  update(
    @Param('id') id: string,
    @Body() updateDiscussDto: UpdateDiscussDto,
    @Req() req: Express.Request,
  ) {
    const { id: user_id } = req.user as TokenPayload;

    return this.discussService.update(+id, updateDiscussDto, user_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discussService.remove(+id);
  }
}
