import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PagingDto } from 'src/common/paging/paging.dto';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private userService: ClientProxy,
    private readonly mailService: MailService,
  ) {}

  async getSinglers(paging: PagingDto) {
    return lastValueFrom(
      this.userService
        .send('getSingers', paging)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  async getSingerDetail(id: number, user_id: number) {
    return lastValueFrom(
      this.userService
        .send('getSingerDetail', { id, user_id })
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }
}
