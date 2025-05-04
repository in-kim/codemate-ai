import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('github')
  async githubLogin(@Body('code') code: string) {
    return await this.authService.loginWithGitHub(code);
  }
}
