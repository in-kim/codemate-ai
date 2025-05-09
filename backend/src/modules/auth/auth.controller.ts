import {
  Controller,
  Res,
  Get,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from 'src/shared/decorators/public.decorator';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { UserDocument } from 'src/models/user.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('github')
  @ApiOperation({ summary: '깃허브 로그인' })
  @ApiQuery({ name: 'code', type: String })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  async githubLogin(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.loginWithGitHub(code);
    // 응답헤더에 쿠키 설정
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    // 유저 정보를 base64로 인코딩하여 전달 (XSS 방지)
    const encodeUser = Buffer.from(
      JSON.stringify({
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
      }),
    ).toString('base64');

    if (!process.env.FRONTEND_URL) {
      throw new Error('FRONTEND_URL이 설정되지 않았습니다.');
    }

    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?user=${encodeUser}`;

    return res.redirect(redirectUrl);
  }

  @Get('me')
  @ApiOperation({ summary: '유저 정보 조회' })
  @ApiResponse({ status: 200, description: '유저 정보 조회 성공' })
  getMe(
    @Req()
    req: Request & UserDocument,
  ) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('유저 정보가 없습니다.');
    }
    return req.user;
  }
}
