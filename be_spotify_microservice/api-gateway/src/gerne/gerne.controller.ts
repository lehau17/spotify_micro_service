import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GerneService } from './gerne.service';
import { CreateGerneDto } from './dto/create-gerne.dto';
import { UpdateGerneDto } from './dto/update-gerne.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/demos/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import RoleType from 'src/common/types/role.type';
import { PagingDto } from 'src/common/paging/paging.dto';
import { Public } from 'src/common/demos/public.deco';
@ApiTags('gerne')
@ApiBearerAuth('access_token')
@Controller('gerne')
export class GerneController {
  constructor(private readonly gerneService: GerneService) {}

  @Post()
  @Roles([RoleType.ADMIN])
  @UseGuards(RolesGuard)
  create(@Body() createGerneDto: CreateGerneDto) {
    return this.gerneService.create(createGerneDto);
  }

  @Get()
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit for pagination ',
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
  @Public()
  findAll(@Query() paging: PagingDto) {
    return this.gerneService.findAll(paging);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gerneService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGerneDto: UpdateGerneDto) {
    return this.gerneService.update(+id, updateGerneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gerneService.remove(+id);
  }
}
