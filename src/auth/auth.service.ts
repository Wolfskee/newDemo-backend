import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';

import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/user/dto/user-input.dto';
import { JwtPayload, Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.validateUser(data);
    const tokens = await this.generateTokens({
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
    return { user, ...tokens };
  }

  async register(data: CreateUserDto) {
    const user = await this.userService.createUser(data);
    const tokens = await this.generateTokens({
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
    return { user, ...tokens };
  }

  async logout(userId: string): Promise<boolean> {
    await this.userService.deleteRefreshToken(userId);
    return true;
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.userService.findUserByIdForAuth(userId);

    if (!user?.refreshToken) throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await compare(refreshToken, user.refreshToken);

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.generateTokens({
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async validateUser(data: LoginDto) {
    const user = await this.userService.findUserByEmailForAuth(data.email);
    if (user && (await compare(data.password, user.password))) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    throw new UnauthorizedException('Invalid email or password');
  }

  async generateTokens(jwtPayload: JwtPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
