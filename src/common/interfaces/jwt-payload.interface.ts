import { NestjsTpRole } from '../enums/nestjs-tp-role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: NestjsTpRole;
  iat?: number;
  exp?: number;
}

