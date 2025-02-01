import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateListFriendDto } from './dto/create-list-friend.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';
import { lastValueFrom } from 'rxjs';
import { UserDto } from './dto/user.dto';
import { ListFriends, Status } from '@prisma/client';
import { PagingDto } from './dto/paging.dto';
import { ListFriendResponseDto } from './dto/find-all-list-friend.dto';

@Injectable()
export class ListFriendService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    private readonly prismaService: PrismaService,
  ) {}

  create(data: CreateListFriendDto): Promise<ListFriends> {
    return this.prismaService.listFriends.create({ data });
  }

  checkStatus(status: string): boolean {
    const objStatus = {
      Enable: new RpcException({
        message: 'Các bạn đã là bạn bè',
        statusCode: HttpStatus.BAD_REQUEST,
      }),
      Disable: true,
      IsPending: new RpcException({
        message: 'Bạn đã gửi lời mời bạn bè',
        statusCode: HttpStatus.BAD_REQUEST,
      }),
      IsRefuse: true,
    };
    const checkStatus = objStatus[status];
    if (typeof status === 'boolean') {
      return checkStatus;
    }
    throw objStatus[status];
  }

  async sendFriendRequest({
    user_id,
    friend_id,
  }: CreateListFriendDto): Promise<ListFriends> {
    // check user
    const foundFriend = await lastValueFrom<UserDto>(
      this.userService.send('findOneUser', friend_id),
    );
    if (!foundFriend || foundFriend.status === 'Disable') {
      throw new RpcException({
        message: 'Friend không tồn tại',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    // check friend exist
    // const checkFoundFriendShip = await this.prismaService.$queryRaw<{
    //   id: number;
    //   status: string;
    // }>`select id, status from "ListFriends" where user_id = ${user_id} and friend_id = ${friend_id}`;
    const checkFoundFriendShip = await this.prismaService.listFriends.findFirst(
      {
        where: {
          user_id,
          friend_id,
        },
        select: {
          id: true,
          status: true,
        },
      },
    );

    if (checkFoundFriendShip) {
      const checkStatus = this.checkStatus(checkFoundFriendShip.status);
      if (!checkStatus) {
        throw new RpcException({
          message: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    }
    // console.log('check found', checkFoundFriendShip);

    return this.create({ user_id, friend_id });
  }

  async acceptFriendShip({
    id,
    receive_user_id,
  }: {
    id: number;
    receive_user_id: number;
  }): Promise<ListFriends> {
    const foundFriendShip = await this.findOne(id);
    if (!foundFriendShip || foundFriendShip.status !== Status.IsPending) {
      throw new RpcException({
        message: 'Friendship not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (foundFriendShip.friend_id !== receive_user_id) {
      throw new RpcException({
        message: 'Chỉ có người nhận mới có quyền chấp nhận kết bạn',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.changeStatus(id, Status.Enable);
  }

  async deniedFriendShip({
    id,
    receive_user_id,
  }: {
    id: number;
    receive_user_id: number;
  }): Promise<ListFriends> {
    const foundFriendShip = await this.findOne(id);
    if (!foundFriendShip || foundFriendShip.status !== Status.IsPending) {
      throw new RpcException({
        message: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (foundFriendShip.friend_id !== receive_user_id) {
      throw new RpcException({
        message: 'Chỉ có người nhận mới có quyền từ chối kết bạn',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.changeStatus(id, Status.IsRefuse);
  }

  async deleteSendFriendShip({
    id,
    send_user_id,
  }: {
    id: number;
    send_user_id: number;
  }): Promise<ListFriends> {
    const foundFriendShip = await this.findOne(id);
    if (!foundFriendShip) {
      throw new RpcException({
        message: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (foundFriendShip.user_id !== send_user_id)
      throw new RpcException({
        message: 'không có quyền gỡ',
        statusCode: HttpStatus.FORBIDDEN,
      });
    return this.prismaService.listFriends.delete({
      where: { id },
    });
  }

  async countFriend(user_id: number): Promise<number> {
    return this.prismaService
      .$queryRaw`select count(id) from ListFriends where user_id = ${user_id}`;
  }

  async disableFriendShip(id: number): Promise<ListFriends> {
    const foundFriendShip = await this.findOne(id);
    if (!foundFriendShip || foundFriendShip.status !== Status.Enable) {
      throw new RpcException({
        message: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.changeStatus(id, Status.Disable);
  }

  async changeStatus(id: number, status: Status): Promise<ListFriends> {
    return this.prismaService.listFriends.update({
      where: { id },
      data: {
        status: status,
      },
    });
  }
  async checkFriendShip(
    user_id: number,
    friend_id: number,
  ): Promise<ListFriends> {
    return this.prismaService.listFriends.findFirst({
      where: {
        friend_id,
        user_id,
      },
    });
  }

  async getStatusFriend(
    user_id: number,
    friend_id: number,
  ): Promise<{ status: string }> {
    let result: { status: string } = {
      status: 'not available',
    };
    result = await this.prismaService.listFriends.findFirst({
      where: {
        user_id,
        friend_id,
      },
      select: {
        status: true,
      },
    });
    if (!result) {
      result.status = 'not available';
    }
    return result;
  }

  listFriend(
    user_id: number,
    { cursor, limit = 20, page = 1 }: PagingDto,
  ): Promise<ListFriendResponseDto[]> {
    const scripts = `select *, count(id) as total_friend from "ListFriends"  WHERE user_id = ${user_id} AND status = 'Enable' ${cursor && `AND id > ${cursor}`} GROUP by id limit ${limit} ${!cursor && `${(+page - 1) * limit}`}`;
    // const options: Prisma.ListFriendsFindManyArgs = {
    //   where: {
    //     user_id: user_id,
    //   },
    //   take: limit,
    //   skip: cursor ? 1 : (+page - 1) * limit,
    //   cursor: cursor
    //     ? {
    //         id: cursor,
    //       }
    //     : undefined,
    // };
    return this.prismaService.$queryRaw<ListFriendResponseDto[]>`${scripts}`;
  }

  findOne(id: number) {
    return this.prismaService.listFriends.findFirst({
      where: { id },
    });
  }
}
