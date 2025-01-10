import { HttpCode, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateFollowingDto } from './dto/create-following.dto';
import { UpdateFollowingDto } from './dto/update-following.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Following, Prisma, Status } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PagingDto } from 'src/common/paging/paging.dto';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { UserDto } from 'src/common/dto/user.dto';

@Injectable()
export class FollowingService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}
  async create({
    following_user_id,
    user_id,
  }: CreateFollowingDto): Promise<Following> {
    // check following user
    const foundFollowingUser = await lastValueFrom<UserDto>(
      this.userService
        .send('findUser', user_id)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
    if (!foundFollowingUser || foundFollowingUser.status === Status.Disable) {
      throw new RpcException({
        message: 'User you follow is not enabled',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.prismaService.following.create({
      data: {
        user_id,
        following_user_id,
      },
    });
  }

  getListFollowingByUser({
    cursor,
    limit,
    page,
    user_id,
  }: PagingDto): Promise<Following[]> {
    const options: Prisma.FollowingFindManyArgs = {
      where: {
        user_id: user_id,
        status: Status.Enable,
      },
      take: limit,
    };
    if (cursor) {
      options.cursor = {
        id: cursor,
      };
      options.skip = 1;
    } else {
      options.skip = (page - 1) * limit;
    }
    return this.prismaService.following.findMany(options);
  }

  findOne(id: number): Promise<Following> {
    return this.prismaService.following.findFirst({
      where: {
        id,
      },
    });
  }

  getFollower(user_id: number, follower_user_id: number): Promise<Following> {
    return this.prismaService.following.findFirst({
      where: { user_id, following_user_id: follower_user_id },
    });
  }

  async toggerFollower(user_id: number, follower_user_id: number) {
    let foundFollower = await this.prismaService.following.findFirst({
      where: { user_id, following_user_id: follower_user_id },
    });
    if (!foundFollower) {
      foundFollower = await this.prismaService.following.create({
        data: { user_id, following_user_id: follower_user_id },
      });
    } else {
      if (foundFollower.status === 'Enable') {
        await this.prismaService.following.update({
          where: { id: foundFollower.id },
          data: {
            status: 'Disable',
          },
        });
      } else {
        await this.prismaService.following.update({
          where: { id: foundFollower.id },
          data: {
            status: 'Enable',
          },
        });
      }
    }
    return foundFollower;
  }

  update(id: number, updateFollowingDto: UpdateFollowingDto) {
    return `This action updates a #${id} following`;
  }

  async remove(id: number, user_id: number) {
    const foundFollowing = await this.findOne(id);
    if (!foundFollowing || foundFollowing.status === Status.Disable) {
      throw new RpcException({
        message: 'User you follow is not enabled',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (foundFollowing.user_id !== user_id)
      throw new RpcException({
        message: 'Forbidden user',
        statusCode: HttpStatus.FORBIDDEN,
      });
    return this.prismaService.following.update({
      where: {
        id,
      },
      data: {
        status: Status.Disable,
      },
    });
  }
}
