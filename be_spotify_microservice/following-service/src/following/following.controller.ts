import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FollowingService } from './following.service';
import { CreateFollowingDto } from './dto/create-following.dto';
import { UpdateFollowingDto } from './dto/update-following.dto';
import { PagingDto } from 'src/common/paging/paging.dto';
import { Following } from './entities/following.entity';

@Controller()
export class FollowingController {
  constructor(private readonly followingService: FollowingService) {}

  @MessagePattern('createFollowing')
  create(
    @Payload() createFollowingDto: CreateFollowingDto,
  ): Promise<Following> {
    return this.followingService.create(createFollowingDto);
  }

  @MessagePattern('findAllFollowing')
  findAll(@Payload() payload: PagingDto): Promise<Following[]> {
    return this.followingService.getListFollowingByUser(payload);
  }

  @MessagePattern('findOneFollowing')
  findOne(@Payload() id: number): Promise<Following> {
    return this.followingService.findOne(id);
  }

  @MessagePattern('updateFollowing')
  update(@Payload() updateFollowingDto: UpdateFollowingDto) {
    return this.followingService.update(
      updateFollowingDto.id,
      updateFollowingDto,
    );
  }

  @MessagePattern('removeFollowing')
  remove(@Payload() { id, user_id }: { id: number; user_id: number }) {
    return this.followingService.remove(id, user_id);
  }

  @MessagePattern('toggerFollower')
  toggerFollower(
    @Payload()
    {
      following_user_id,
      user_id,
    }: {
      user_id: number | null;
      following_user_id: number | null;
    },
  ) {
    return this.followingService.toggerFollower(user_id, following_user_id);
  }

  @MessagePattern('getFollower')
  getFollower(
    @Payload()
    {
      follower_user_id,
      user_id,
    }: {
      user_id: number;
      follower_user_id: number;
    },
  ) {
    return this.followingService.getFollower(user_id, follower_user_id);
  }
}
