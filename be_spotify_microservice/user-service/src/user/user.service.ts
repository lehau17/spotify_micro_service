import { roles } from './../../node_modules/.prisma/client/index.d';
import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { StatusUser } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { TokenPayload } from 'src/common/jwt/access_token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResponse } from './dto/response/login.response.dto';
import { RegisterDto } from './dto/register-user.dto';
import { RegisterResponseDto } from './dto/response/register.response.dto';
@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async login({ username, password }: LoginDto): Promise<LoginResponse> {
    //check found user
    const foundUser = await this.prismaService.users.findFirst({
      where: {
        account: username,
      },
      include: {
        role: true,
      },
    });
    if (!foundUser || foundUser.status === StatusUser.Disable) {
      throw new RpcException({
        message: 'User with username ' + username + ' not found',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (!bcrypt.compareSync(password, foundUser.password)) {
      throw new RpcException({
        message: 'Username or password incorrect',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    // generate token
    const token = await this.generateToken({
      id: foundUser.id,
      role: [foundUser.role.name],
    });
    if (token && token.refreshToken) {
      await this.prismaService.users.update({
        where: {
          id: foundUser.id,
        },
        data: {
          refreshToken: token.refreshToken,
        },
      });
    }
    return {
      info_user: foundUser,
      token,
    };
  }

  async generateToken(
    payload: TokenPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_KEY'),
        expiresIn: '1y',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async register(payload: RegisterDto): Promise<RegisterResponseDto> {
    // check user email
    const foundUser = await this.prismaService.users.findFirst({
      where: {
        account: payload.account,
      },
    });
    if (foundUser) {
      throw new RpcException({
        message: 'User already registered',
        statusCode: 400,
      });
    }
    const newUser = await this.prismaService.users.create({
      data: {
        ...payload,
        password: bcrypt.hashSync(payload.password, 10),
        status: StatusUser.IsPendingVerifyEmail,
        role: {
          connect: {
            id: 1,
          },
        },
      },
    });
    if (!newUser)
      throw new RpcException({
        message: 'Có lỗi xảy ra khi tạo user',
        statusCode: 500,
      });
    const token = await this.generateToken({ id: newUser.id, role: ['USER'] });
    return {
      info_user: newUser,
      token,
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
