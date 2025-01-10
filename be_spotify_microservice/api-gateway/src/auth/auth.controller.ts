import { Body, Controller, Get, Patch, Post, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from 'src/common/demos/public.deco';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { TokenPayload } from 'src/common/types/jwt.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  login(@Body() payload: LoginDto) {
    console.log('check ', process.env.RABBITMQ_URL);
    return this.authService.login(payload);
  }

  @Get('verify-account')
  @Public()
  verify(@Query('verifyToken') token: string) {
    return this.authService.verifyToken(token);
  }

  @Post('register')
  @Public()
  register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Patch('change-password')
  @ApiBearerAuth('access_token')
  changePassword(
    @Body() payload: ChangePasswordDto,
    @Req() req: Express.Request,
  ) {
    const { id } = req.user as TokenPayload;
    return this.authService.changePassword(payload, id);
  }

  @Patch('request-change-password')
  @ApiBearerAuth('access_token')
  requestChangePassword(@Req() req: Express.Request) {
    const { id } = req.user as TokenPayload;
    return this.authService.requestChangePassword(id);
  }

  @Get('verify-change-password')
  @ApiBearerAuth('access_token')
  verifyChangePassword(
    @Query('token') token: string,
    @Req() req: Express.Request,
  ) {
    const { id } = req.user as TokenPayload;
    return this.authService.checkAcceptchangePassword({ token, user_id: id });
  }
}
