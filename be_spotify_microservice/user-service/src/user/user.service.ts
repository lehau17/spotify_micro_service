import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { StatusUser } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { TokenPayload } from 'src/common/jwt/access_token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResponse } from './dto/response/login.response.dto';
import { RegisterDto } from './dto/register-user.dto';
import { RegisterResponseDto } from './dto/response/register.response.dto';
import Redis from 'ioredis';
import { CacheService } from 'src/cache/cache.service';
import { PagingDto } from './common/paging/paging.dto';
import { last, lastValueFrom } from 'rxjs';
import {
  DetailSingerResponseDto,
  SongDto,
} from './dto/response/singer-detail.dto.response';
import { Following } from './dto/response/follow.dtp.response';
@Injectable()
export class UserService {
  private redis: Redis;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('MAIL_SERVICE') private readonly mailService: ClientProxy,
    @Inject('SONG_SERVICE') private readonly songService: ClientProxy,
    @Inject('FOLLOWING_SERVICE') private readonly followerService: ClientProxy,
  ) {
    this.redis = CacheService.getClient();
  }

  async getSingers(paging: PagingDto) {
    return this.prismaService.users.findMany({
      where: {
        role: {
          id: 3,
        },
      },
      include: {
        role: true,
      },
    });
  }

  /**
   * @description only role
   */
  async getSingerDetail(
    id: number,
    user_id: number,
  ): Promise<DetailSingerResponseDto> {
    const foundSinger = await this.prismaService.users.findFirst({
      where: {
        id,
      },
      include: {
        role: true,
      },
    });
    if (!foundSinger || foundSinger.role.name !== 'SINGER') {
      throw new RpcException({
        message: 'User not singer',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const [listSongByUser, checkFollower] = await Promise.all([
      await lastValueFrom<SongDto[]>(
        this.songService.send('listSongByUser', id),
      ),
      await lastValueFrom<Following>(
        this.followerService.send('getFollower', {
          user_id,
          follower_user_id: foundSinger.id,
        }),
      ),
    ]);
    const isFollow = Boolean(checkFollower);
    //
    return {
      ...foundSinger,
      songs: listSongByUser,
      isFollow,
    };
    //check if friend
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
        message: 'Username or password incorrect',
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
      name: foundUser.name,
      url: foundUser.avatar,
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

  verifyAccount(token: string): Promise<boolean> {
    const decode = this.jwtService
      .verifyAsync<TokenPayload>(token, {
        secret: this.configService.get<string>('VERIFY_TOKEN_KEY'),
      })
      .then(async (res) => {
        // update user
        await this.prismaService.users.update({
          where: {
            id: res.id,
          },
          data: {
            status: StatusUser.Enable,
          },
        });
        return true;
      })
      .catch((err) => {
        // console.log(err);
        return false;
      });
    return decode;
  }

  checkAcceptchangePassword({
    token,
    user_id,
  }: {
    token: string;
    user_id: number;
  }): Promise<boolean> {
    console.log('check payload', token, user_id);
    const decode = this.jwtService
      .verifyAsync<TokenPayload>(token, {
        secret: this.configService.get<string>('VERIFY_TOKEN_KEY'),
      })
      .then(async (res) => {
        // update user
        const isFound = await this.redis.get(`change_password:${user_id}`);
        console.log('Check isFound: ' + isFound);
        if (!isFound || isFound === '') {
          // return false;
          throw new RpcException({
            message: 'BAD_REQUEST',
            statusCode: HttpStatus.BAD_REQUEST,
          });
        }
        //xoa token duoi cache
        await Promise.all([
          await this.redis.del(`change_password:${user_id}`),
          await this.redis.setex(
            `accepct_change_password:${user_id}`,
            30 * 60,
            1,
          ),
        ]);
        return true;
        //
      })
      .catch(async (err) => {
        console.log('check error', err);
        return false;
      });
    return decode;
  }

  async requestChangePassword(id: number): Promise<boolean> {
    const [token, foundUser] = await Promise.all([
      await this.signToken(id),
      await this.prismaService.users.findFirst({
        where: { id },
      }),
    ]);
    if (!token || !foundUser) {
      throw new RpcException({
        message: 'BAD_REQUEST',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    await this.redis.setex(`change_password:${id}`, 300, token);
    this.mailService.emit('sendMail', {
      to: [foundUser.account],
      context: {
        verificationUrl:
          process.env.URL_BACKEND +
          `/verify-change-password?verifyToken=${token}`,
        customerName: foundUser.account,
        year: new Date().getFullYear(),
      },
      subject: 'Verify change password Spotify',
      template: './verify-change-password.hbs',
    });
    return true;
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

  async signToken(id: number): Promise<string> {
    return this.jwtService.signAsync(
      { id },
      {
        secret: this.configService.get<string>('VERIFY_TOKEN_KEY'),
        expiresIn: '5m',
      },
    );
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
    const [token, verifyEmail] = await Promise.all([
      await this.generateToken({
        id: newUser.id,
        role: ['USER'],
        name: newUser.name || '',
        url: newUser.avatar || '',
      }),
      await this.signToken(newUser.id),
    ]);

    this.mailService.emit('sendMail', {
      to: [newUser.account],
      context: {
        verificationUrl:
          process.env.URL_BACKEND +
          `/auth/verify-account?verifyToken=${verifyEmail}`,
        customerName: newUser.account,
        year: new Date().getFullYear(),
      },
      subject: 'Verify Accout Spotify',
      template: './verify-email.hbs',
    });
    return {
      info_user: newUser,
      token,
    };
  }

  async changePassword({
    id,
    newPassword,
  }: {
    id: number;
    newPassword: string;
  }): Promise<boolean> {
    // check if accept
    const isAccept = await this.redis.get(`accepct_change_password:${id}`);
    if (!isAccept || isAccept !== '1') {
      throw new RpcException({
        message: `Could not change password`,
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    const newUser = await this.prismaService.users.update({
      where: {
        id,
      },
      data: {
        password: bcrypt.hashSync(newPassword, 10),
      },
    });

    await this.redis.del(`accepct_change_password:${id}`);
    return newUser !== null;
  }
}
