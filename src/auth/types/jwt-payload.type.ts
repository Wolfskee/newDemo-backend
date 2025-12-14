import { UserRole } from '../../generated/prisma/client';

export type JwtPayload = {
  sub: string;
  username: string;
  email: string;
  role: UserRole;
};

export type RefreshTokenJwtPayload = JwtPayload & {
  refreshToken: string;
};
