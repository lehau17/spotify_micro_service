import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { DiscussService } from './discuss.service';
import { CreateDiscussDto } from './dto/create-discuss.dto';
import { UpdateDiscussDto } from './dto/update-discuss.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TokenPayload } from 'src/common/types/jwt.type';
import { Public } from 'src/common/demos/public.deco';
import { PagingDto } from 'src/common/paging/paging.dto';
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

  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit for pagination',
    example: 20,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: Number,
    description: 'Cursor for pagination',
  })
  @Get('list-by-song/:id')
  @Public()
  findAll(@Query() paging: PagingDto, @Param('id') song_id: string) {
    paging.fullFill();
    return this.discussService.findListDiscussBySong(paging, +song_id);
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
  remove(@Param('id') id: string, @Req() req: Express.Request) {
    const { id: user_id } = req.user as TokenPayload;
    return this.discussService.remove(+id, user_id);
  }
}
