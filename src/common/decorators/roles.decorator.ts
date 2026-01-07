import { SetMetadata } from '@nestjs/common';
import { NestjsTpRole } from '../enums/nestjs-tp-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: NestjsTpRole[]) => SetMetadata(ROLES_KEY, roles);

