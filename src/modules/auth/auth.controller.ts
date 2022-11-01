import {
  Body,
  Controller,
  HttpCode,
  Req,
  Post,
  UseGuards,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import ForgotPasswordDto from './dtos/forgot-password.dto';
import RegisterDto from './dtos/register.dto';
import JwtAuthGuard from './guards/jwt-auth.guard';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import RequestWithUser from './interfaces/request-with-user.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private mailService: MailService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return this.mailService.sendConfirmationEmail(registerDto.email);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieAccessToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieRefreshToken(user.id);

    await this.userService.setRefreshToken(refreshToken, user.id);
    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    // delete user.password;
    // delete user.currentRefreshToken;

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('re-verify')
  async resendConfirmEmail(@Req() request: RequestWithUser) {
    await this.mailService.resendConfirmationEmail(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.userService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    // delete user.password;
    // delete user.currentRefreshToken;
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieAccessToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @Post('forgot-password')
  async handleForgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.authService.checkEmailForgotPassword(
      forgotPasswordDto.forgotPasswordEmail,
    );
    return this.mailService.sendForgotPasswordEmail(user.email);
  }
}
