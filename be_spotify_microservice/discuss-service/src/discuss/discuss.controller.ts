import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DiscussService } from './discuss.service';
import { CreateDiscussDto } from './dto/create-discuss.dto';
import { UpdateDiscussDto } from './dto/update-discuss.dto';

@Controller()
export class DiscussController {
  constructor(private readonly discussService: DiscussService) {}

  @MessagePattern('createDiscuss')
  create(@Payload() createDiscussDto: CreateDiscussDto) {
    return this.discussService.create(createDiscussDto);
  }

  @MessagePattern('findAllDiscuss')
  findAll() {
    return this.discussService.findAll();
  }

  @MessagePattern('findOneDiscuss')
  findOne(@Payload() id: number) {
    return this.discussService.findOne(id);
  }

  @MessagePattern('updateDiscuss')
  update(@Payload() updateDiscussDto: UpdateDiscussDto) {
    return this.discussService.update(updateDiscussDto.id, updateDiscussDto);
  }

  @MessagePattern('removeDiscuss')
  remove(@Payload() { id, user_id }: { id: number; user_id: number }) {
    return this.discussService.remove(id, user_id);
  }
}
