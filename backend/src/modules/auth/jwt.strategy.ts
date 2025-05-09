import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: (req: Request): string => {
        // 쿠키에서 accessToken을 가져옴
        const token = req?.cookies?.accessToken as string;
        return token || '';
      },
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: { sub: string; username: string; avatarUrl: string }) {
    // payload: { sub: userId, username: string } 형식
    // 이 리턴값은 Request.user로 들어감
    return {
      userId: payload.sub,
      username: payload.username,
      avatarUrl: payload.avatarUrl,
    };
  }
}
