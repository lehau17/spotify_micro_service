import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GerneService } from './gerne.service';
import { CreateGerneDto } from './dto/create-gerne.dto';
import { UpdateGerneDto } from './dto/update-gerne.dto';
import { PagingDto } from 'src/common/paging/paging.dto';

@Controller()
export class GerneController {
  constructor(private readonly gerneService: GerneService) {}

  @MessagePattern('createGerne')
  create(@Payload() createGerneDto: CreateGerneDto) {
    return this.gerneService.create(createGerneDto);
  }

  @MessagePattern('findAllGerne')
  findAll(@Payload() paging: PagingDto) {
    return this.gerneService.findAll(paging);
  }

  @MessagePattern('findOneGenre')
  findOne(@Payload() id: number) {
    return this.gerneService.findOne(id);
  }

  @MessagePattern('updateGerne')
  update(@Payload() updateGerneDto: UpdateGerneDto) {
    return this.gerneService.update(updateGerneDto);
  }

  @MessagePattern('removeGerne')
  remove(@Payload() id: number) {
    return this.gerneService.remove(id);
  }
}
