import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import UserEntity from 'src/model/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService
  ) {
    super({
      usernameField: 'email'
    })
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    return this.authService.validateUserAndPassword(email, password);
  }
}