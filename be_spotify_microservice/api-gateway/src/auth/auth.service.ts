import { Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';

@Injectable()
export class AuthService {
  constructor(@Inject('USER_SERVICE') private userService: ClientProxy) {}
  async login(payload: LoginDto) {
    return lastValueFrom(
      this.userService
        .send('loginUser', payload)
        .pipe(handleRetryWithBackoff(3, 2000)),
    );
  }
}
