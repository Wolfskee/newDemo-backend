import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';

import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/user/dto/user-input.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(data: LoginDto) {
    const user = await this.validateUser(data);
    return user;
  }

  async register(data: CreateUserDto) {
    return await this.userService.createUser(data);
  }

  async validateUser(data: LoginDto) {
    const user = await this.userService.findUserForAuth(data.email);
    if (user && (await compare(data.password, user.password))) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    throw new UnauthorizedException('Invalid email or password');
  }
}
