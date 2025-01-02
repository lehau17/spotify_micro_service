import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GerneService } from './gerne.service';
import { CreateGerneDto } from './dto/create-gerne.dto';
import { UpdateGerneDto } from './dto/update-gerne.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/demos/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import RoleType from 'src/common/types/role.type';
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
  findAll() {
    return this.gerneService.findAll();
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
