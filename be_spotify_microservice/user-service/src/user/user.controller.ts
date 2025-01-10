import { Controller, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register-user.dto';
import { PagingDto } from './common/paging/paging.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('verifyAccount')
  verifyAccount(@Payload() token: string) {
    return this.userService.verifyAccount(token);
  }

  @MessagePattern('login')
  login(@Payload() Payload: LoginDto) {
    return this.userService.login(Payload);
  }

  @MessagePattern('register')
  register(@Payload() Payload: RegisterDto) {
    return this.userService.register(Payload);
  }

  @MessagePattern('checkAcceptchangePassword')
  checkAcceptchangePassword(
    @Payload() payload: { token: string; user_id: number },
  ) {
    return this.userService.checkAcceptchangePassword(payload);
  }

  @MessagePattern('changePassword')
  changePassword(@Payload() payload: { id: number; newPassword: string }) {
    return this.userService.changePassword(payload);
  }

  @MessagePattern('requestChangePassword')
  requestChangePassword(@Payload() user_id: number) {
    return this.userService.requestChangePassword(user_id);
  }

  @MessagePattern('getSingers')
  getSingers(@Payload() paging: PagingDto) {
    return this.userService.getSingers(paging);
  }

  // @MessagePattern('findAllUser')
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @MessagePattern('findOneUser')
  // findOne(@Payload() id: number) {
  //   return this.userService.findOne(id);
  // }

  // @MessagePattern('updateUser')
  // update(@Payload() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(updateUserDto.id, updateUserDto);
  // }

  // @MessagePattern('removeUser')
  // remove(@Payload() id: number) {
  //   return this.userService.remove(id);
  // }
}
