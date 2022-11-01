import {  
  Body,
  Controller,  
  Delete,  
  Get, 
  Post, 
  Put, 
  Req, 
  Res, 
  UploadedFile, 
  UseGuards, 
  UseInterceptors, 
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { of } from 'rxjs';
import { UserEntity } from 'src/model/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { join } from 'path';
import RequestWithUser from '../auth/interfaces/request-with-user.interface';
import UpdateProfileDto from './dtos/update-profile.dto';
import { avatarStorageOptions } from './helpers/avatar-storage';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService
  ) {}

  @Put('update-profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() request: RequestWithUser, @Body() userData: UpdateProfileDto) {
    return await this.userService.updateProfile(request.user.id, userData);
  }

  @Post('save-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', avatarStorageOptions))
  async saveAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: RequestWithUser
  ) {
    return await this.userService.addAvatarToQueue(request.user.id, file);
  }

  @Get('get-avatar-40x40')
  @UseGuards(JwtAuthGuard)
  async findAvatar40(@Req() request: RequestWithUser, @Res() res) {
    const user = await this.userService.getUserById(request.user.id);

    return of(res.sendFile(join(process.cwd(), './uploads/avatars/40x40/' + user.avatar)));
  }

  @Get('get-avatar-70x70')
  @UseGuards(JwtAuthGuard)
  async findAvatar70(@Req() request: RequestWithUser, @Res() res) {
    const user = await this.userService.getUserById(request.user.id);

    return of(res.sendFile(join(process.cwd(), './uploads/avatars/70x70/' + user.avatar)));
  }

  @Delete('delete-avatar')
  @UseGuards(JwtAuthGuard)
  async deleteAvatar(@Req() request: RequestWithUser) {
    return this.userService.deleteAvatar(request.user.id);
  }
} 