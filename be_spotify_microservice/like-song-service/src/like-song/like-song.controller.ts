import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LikeSongService } from './like-song.service';
import { CreateLikeSongDto } from './dto/create-like-song.dto';
import { UpdateLikeSongDto } from './dto/update-like-song.dto';

@Controller()
export class LikeSongController {
  constructor(private readonly likeSongService: LikeSongService) {}

  @MessagePattern('createLikeSong')
  create(@Payload() createLikeSongDto: CreateLikeSongDto) {
    return this.likeSongService.create(createLikeSongDto);
  }

  @MessagePattern('findAllLikeSong')
  findAll() {
    return this.likeSongService.findAll();
  }

  @MessagePattern('findOneLikeSong')
  findOne(@Payload() id: number) {
    return this.likeSongService.findOne(id);
  }

  @MessagePattern('updateLikeSong')
  update(@Payload() updateLikeSongDto: UpdateLikeSongDto) {
    return this.likeSongService.update(updateLikeSongDto.id, updateLikeSongDto);
  }

  @MessagePattern('removeLikeSong')
  remove(@Payload() id: number) {
    return this.likeSongService.remove(id);
  }
}
