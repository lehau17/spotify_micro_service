import { PagingDto } from './../../../genre-service/src/common/paging/paging.dto';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { SongService } from './song.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Controller()
export class SongController {
  constructor(private readonly songService: SongService) {}

  @MessagePattern('findAllSong')
  findAll() {
    return this.songService.findAll();
  }
  @MessagePattern('taoBaiHat')
  create(@Payload() createSongDto: CreateSongDto) {
    return this.songService.create(createSongDto);
  }

  @MessagePattern('findOneSong')
  findOne(@Payload() id: number) {
    return this.songService.findOne(id);
  }

  @MessagePattern('listDeXuatBaiHat')
  listDeXuatBaiHat(@Payload() paging: PagingDto) {
    return this.songService.deXuatBaiHat(paging);
  }

  @MessagePattern('listMySong')
  listMySong(@Payload() paging: PagingDto & { user_id: number }) {
    return this.songService.listMySong(paging);
  }

  @MessagePattern('updateSong')
  update(@Payload() updateSongDto: UpdateSongDto) {
    return this.songService.update(updateSongDto);
  }

  @MessagePattern('removeSong')
  remove(@Payload() { id, user_id }: { id: number; user_id: number }) {
    return this.songService.remove(id, user_id);
  }
}
