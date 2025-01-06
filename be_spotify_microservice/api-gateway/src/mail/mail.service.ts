import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MailService {
  constructor(
    @Inject('MAIL_SERVICE') private readonly mailService: ClientProxy,
  ) {}
  sendMailRegisterAccountSuccess(to: string[], context: Record<string, any>) {
    this.mailService.emit('sendMail', {
      to,
      context,
      subject: 'Welcome to My Spotify',
      template: './welcome.hbs',
    });
  }
}
