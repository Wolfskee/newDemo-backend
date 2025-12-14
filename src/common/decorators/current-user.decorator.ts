import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload, RefreshTokenJwtPayload } from 'src/auth/types';

export type AuthPayload = JwtPayload | RefreshTokenJwtPayload;

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as JwtPayload;

    return data ? user[data] : user;
  },
);

export const CurrentUserWithRefreshToken = createParamDecorator(
  (data: keyof RefreshTokenJwtPayload | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as RefreshTokenJwtPayload;

    return data ? user[data] : user;
  },
);
