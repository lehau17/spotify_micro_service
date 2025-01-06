import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LikeSongService } from './like-song.service';
import { CreateLikeSongDto } from './dto/create-like-song.dto';
import { PagingDto } from 'src/common/paging/paging.dto';

@Controller()
export class LikeSongController {
  constructor(private readonly likeSongService: LikeSongService) {}

  @MessagePattern('createLikeSong')
  create(@Payload() createLikeSongDto: CreateLikeSongDto) {
    return this.likeSongService.create(createLikeSongDto);
  }

  @MessagePattern('findAllLikeSong')
  findAll(
    @Payload()
    paging: PagingDto & {
      song_id: number;
    },
  ) {
    return this.likeSongService.findAll(paging);
  }

  @MessagePattern('findOneLikeSong')
  findOne(@Payload() id: number) {
    return this.likeSongService.findOne(id);
  }

  // @MessagePattern('updateLikeSong')
  // update(@Payload() updateLikeSongDto: UpdateLikeSongDto) {
  //   return this.likeSongService.update(updateLikeSongDto.id, updateLikeSongDto);
  // }

  @MessagePattern('removeLikeSong')
  remove(@Payload() payload: { id: number; user_id: number }) {
    return this.likeSongService.remove(payload);
  }
}
