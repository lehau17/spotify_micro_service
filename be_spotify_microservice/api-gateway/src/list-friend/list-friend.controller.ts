import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { ListFriendService } from './list-friend.service';
import { CreateListFriendDto } from './dto/create-list-friend.dto';
import { UpdateListFriendDto } from './dto/update-list-friend.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TokenPayload } from 'src/common/types/jwt.type';
import { ChangeStatusDto } from './dto/change-status.dto';
import { PagingDto } from 'src/common/paging/paging.dto';

@Controller('list-friend')
@ApiTags('list-friend')
@ApiBearerAuth('access_token')
export class ListFriendController {
  constructor(private readonly listFriendService: ListFriendService) {}

  @Post('send-request')
  create(
    @Body() createListFriendDto: CreateListFriendDto,
    @Req() req: Express.Request,
  ) {
    const { id } = req.user as TokenPayload;
    return this.listFriendService.sendFriendRequest(createListFriendDto, id);
  }

  @Get('me')
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit for pagination',
    example: 20,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: Number,
    description: 'Cursor for pagination',
  })
  findAll(@Query() paging: PagingDto, @Req() req: Express.Request) {
    const { id } = req.user as TokenPayload;
    return this.listFriendService.listFriend(id, paging);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listFriendService.findOne(+id);
  }

  @Patch(':id/accept')
  acceptRequest(@Param('id') id: string, @Req() req: Express.Request) {
    const { id: receive_user_id } = req.user as TokenPayload;
    return this.listFriendService.acceptRequest(+id, receive_user_id);
  }

  @Patch(':id/deny')
  deniRequestChange(@Param('id') id: string, @Req() req: Express.Request) {
    const { id: receive_user_id } = req.user as TokenPayload;
    return this.listFriendService.deniedFriendShip(+id, receive_user_id);
  }

  @Patch(':id/disable')
  disableRequest(@Param('id') id: string, @Req() req: Express.Request) {
    const { id: receive_user_id } = req.user as TokenPayload;
    return this.listFriendService.deniedFriendShip(+id, receive_user_id);
  }

  @Patch(':id/change-status')
  changeStatus(@Param('id') id: string, @Body() body: ChangeStatusDto) {
    return this.listFriendService.changeStatus(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Express.Request) {
    const { id: send_user_id } = req.user as TokenPayload;
    return this.listFriendService.remove(+id, send_user_id);
  }
}
