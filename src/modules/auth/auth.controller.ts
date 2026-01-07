import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Verify2FADto } from './dto/verify-2fa.dto';
import { ResendEmailDto } from './dto/resend-email.dto';
import { PublicEndpoint } from '../../common/decorators/public-endpoint.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @PublicEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 200,
    description: 'Registration successful',
    schema: {
      example: {
        message: 'Registration successful. Please check your email to verify your account.',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email or username already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email already exists',
        error: 'Conflict',
      },
    },
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify-email')
  @PublicEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user email address' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    schema: {
      example: {
        message: 'Email verified successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid verification token',
        error: 'Bad Request',
      },
    },
  })
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('login')
  @PublicEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user (sends 2FA code)' })
  @ApiResponse({
    status: 200,
    description: '2FA code sent to email',
    schema: {
      example: {
        message: '2FA code sent to your email',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or email not verified',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('verify-2fa')
  @PublicEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify 2FA code and get JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns JWT token',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired 2FA code',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid 2FA code',
        error: 'Unauthorized',
      },
    },
  })
  verify2FA(@Body() verify2FADto: Verify2FADto) {
    return this.authService.verify2FA(verify2FADto);
  }

  @Post('resend-verification-email')
  @PublicEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend email verification token' })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent',
    schema: {
      example: {
        message: 'Verification email sent',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email already verified',
    schema: {
      example: {
        statusCode: 400,
        message: 'Email already verified',
        error: 'Bad Request',
      },
    },
  })
  resendVerificationEmail(@Body() resendEmailDto: ResendEmailDto) {
    return this.authService.resendVerificationEmail(resendEmailDto.email);
  }

  @Post('resend-2fa-code')
  @PublicEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend 2FA code' })
  @ApiResponse({
    status: 200,
    description: '2FA code sent',
    schema: {
      example: {
        message: '2FA code sent',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  resend2FACode(@Body() resendEmailDto: ResendEmailDto) {
    return this.authService.resend2FACode(resendEmailDto.email);
  }
}

