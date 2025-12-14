import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/user-input.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import {
  CurrentUser,
  CurrentUserWithRefreshToken,
  Public,
} from 'src/common/decorators';
import { Tokens } from './types';
import { RefreshTokenGuard } from 'src/common/guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }

  @Public()
  @Post('register')
  async register(@Body() data: CreateUserDto) {
    return await this.authService.register(data);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser('sub') userId: string): Promise<boolean> {
    return await this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @CurrentUserWithRefreshToken('sub') userId: string,
    @CurrentUserWithRefreshToken('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
