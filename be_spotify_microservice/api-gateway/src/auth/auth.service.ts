import { Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { RegisterDto } from './dto/register.dto';
import { MailService } from 'src/mail/mail.service';
import { RegisterResponseDto } from './dto/register.response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private userService: ClientProxy,
    private readonly mailService: MailService,
  ) {}

  async verifyToken(token: string) {
    return lastValueFrom(
      this.userService
        .send('verifyAccount', token)
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
  }

  async login(payload: LoginDto) {
    return lastValueFrom(
      this.userService
        .send('login', payload)
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
  }

  async register(payload: RegisterDto) {
    const result = await lastValueFrom<RegisterResponseDto>(
      this.userService
        .send('register', payload)
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
    this.mailService.sendMailRegisterAccountSuccess(
      [result.info_user.account],
      {
        name: result.info_user.account,
        actionUrl: 'http://localhost',
        year: 2024,
      },
    );
    return result;
  }
}
