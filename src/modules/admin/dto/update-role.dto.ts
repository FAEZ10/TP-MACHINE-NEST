import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NestjsTpRole } from '../../../common/enums/nestjs-tp-role.enum';

export class UpdateRoleDto {
  @ApiProperty({
    example: NestjsTpRole.ADMIN,
    enum: NestjsTpRole,
    description: 'New role for the user',
  })
  @IsEnum(NestjsTpRole)
  @IsNotEmpty()
  role: NestjsTpRole;
}

