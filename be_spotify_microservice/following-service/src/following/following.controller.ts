import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FollowingService } from './following.service';
import { CreateFollowingDto } from './dto/create-following.dto';
import { UpdateFollowingDto } from './dto/update-following.dto';

@Controller()
export class FollowingController {
  constructor(private readonly followingService: FollowingService) {}

  @MessagePattern('createFollowing')
  create(@Payload() createFollowingDto: CreateFollowingDto) {
    return this.followingService.create(createFollowingDto);
  }

  @MessagePattern('findAllFollowing')
  findAll() {
    return this.followingService.findAll();
  }

  @MessagePattern('findOneFollowing')
  findOne(@Payload() id: number) {
    return this.followingService.findOne(id);
  }

  @MessagePattern('updateFollowing')
  update(@Payload() updateFollowingDto: UpdateFollowingDto) {
    return this.followingService.update(updateFollowingDto.id, updateFollowingDto);
  }

  @MessagePattern('removeFollowing')
  remove(@Payload() id: number) {
    return this.followingService.remove(id);
  }
}
