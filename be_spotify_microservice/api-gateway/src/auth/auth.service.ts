import { Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('USER_SERVICE') private userService: ClientProxy) {}
  async login(payload: LoginDto) {
    return lastValueFrom(
      this.userService
        .send('login', payload)
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
  }

  async register(payload: RegisterDto) {
    return lastValueFrom(
      this.userService
        .send('register', payload)
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
  }
}
