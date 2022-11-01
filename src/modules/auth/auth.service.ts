import {
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import RegisterDto from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import TokenPayload from './interfaces/token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import JwtAuthGuard from './guards/jwt-auth.guard';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    try {
      const newUser = await this.userService.createUser({
        ...registerDto,
        password: hashedPassword,
      });

      return newUser;
    } catch (error) {
      if (error?.code == 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Email has already been taken',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async validateUserAndPassword(email: string, rawPassword: string) {
    const user = await this.userService.getUserByEmail(email);
    await this.checkPassword(rawPassword, user.password);
    user.password = undefined;
    return user;
  }

  private async checkPassword(rawPassword: string, hashedPassword: string) {
    const isPasswordTrue = await bcrypt.compare(rawPassword, hashedPassword);

    if (!isPasswordTrue) {
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }
  }

  public getCookieAccessToken(id: number) {
    const payload: TokenPayload = { id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  public getCookieRefreshToken(id: number) {
    const payload: TokenPayload = { id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;

    return { cookie, token };
  }

  public getCookieForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async checkEmailForgotPassword(email: string) {
    const user = this.userService.getUserByEmail(email);

    if (!user) {
      throw new HttpException(
        'No users have been registered with this email',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }
}
