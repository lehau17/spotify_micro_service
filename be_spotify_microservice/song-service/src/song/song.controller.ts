import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SongService } from './song.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Controller()
export class SongController {
  constructor(private readonly songService: SongService) {}

  @MessagePattern('createSong')
  create(@Payload() createSongDto: CreateSongDto) {
    return this.songService.create(createSongDto);
  }

  @MessagePattern('findAllSong')
  findAll() {
    return this.songService.findAll();
  }

  @MessagePattern('findOneSong')
  findOne(@Payload() id: number) {
    return this.songService.findOne(id);
  }

  @MessagePattern('updateSong')
  update(@Payload() updateSongDto: UpdateSongDto) {
    return this.songService.update(updateSongDto.id, updateSongDto);
  }

  @MessagePattern('removeSong')
  remove(@Payload() id: number) {
    return this.songService.remove(id);
  }
}
