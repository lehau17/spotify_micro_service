import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from 'src/common/demos/public.deco';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  login(@Body() payload: LoginDto) {
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
}
