import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthService, AuthTokenResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({
    schema: {
      example: {
        access_token: 'jwt-token',
        user: {
          id: 'uuid',
          email: 'user@example.com',
          role: 'rh',
          orgId: null,
        },
      },
    },
  })
  register(@Body() payload: RegisterDto): Promise<AuthTokenResponse> {
    return this.authService.register(payload);
  }

  @Post('login')
  @ApiOkResponse({
    schema: {
      example: {
        access_token: 'jwt-token',
        user: {
          id: 'uuid',
          email: 'user@example.com',
          role: 'rh',
          orgId: null,
        },
      },
    },
  })
  login(@Body() payload: LoginDto): Promise<AuthTokenResponse> {
    return this.authService.login(payload);
  }
}
