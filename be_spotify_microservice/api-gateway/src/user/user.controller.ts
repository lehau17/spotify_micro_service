import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PagingDto } from 'src/common/paging/paging.dto';
import { Public } from 'src/common/demos/public.deco';
import { TokenPayload } from 'src/common/types/jwt.type';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth('access_token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('singer')
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
  @Public()
  getSinger(@Query() paging: PagingDto) {
    return this.userService.getSinglers(paging);
  }

  @Get(':id/singer-detail')
  getSingerDetail(@Param('id') id: string, @Req() req: Express.Request) {
    const { id: user_id } = req.user as TokenPayload;
    // console.log('check id: ' + id);
    return this.userService.getSingerDetail(+id, user_id);
  }
}
