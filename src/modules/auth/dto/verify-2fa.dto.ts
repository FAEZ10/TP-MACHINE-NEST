import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Verify2FADto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '654321',
    description: '6-digit 2FA code sent by email',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

