import { Controller } from '@nestjs/common';
import PlaylistServiceVer2 from './playlist.ver2.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
class PlaylistVer2Controller {
  constructor(private readonly playlistServiceVer2: PlaylistServiceVer2) {}

  @MessagePattern('findOneVer2')
  findOne(@Payload() payload: number) {
    return this.playlistServiceVer2.findOne(payload);
  }
}

export default PlaylistVer2Controller;
