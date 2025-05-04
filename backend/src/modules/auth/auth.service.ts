import axios from 'axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { JwtService } from '@nestjs/jwt';

interface GitHubTokenResponse {
  access_token: string;
  scope: string;
  token_type: string;
}
interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: object): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }
  async loginWithGitHub(code: string) {
    try {
      // 1. GitHub로부터 access token 획득
      const tokenResponse = await axios.post<GitHubTokenResponse>(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        { headers: { Accept: 'application/json' } },
      );

      const githubAccessToken = tokenResponse.data.access_token;

      // 2. GitHub 유저 정보 요청
      const userResponse = await axios.get<GitHubUser>(
        'https://api.github.com/user',
        {
          headers: { Authorization: `Bearer ${githubAccessToken}` },
        },
      );

      const { id, login, email, avatar_url } = userResponse.data;

      // 3. DB에 유저 정보 upsert
      const user = await User.findOneAndUpdate(
        { githubId: id.toString() },
        {
          githubId: id.toString(),
          username: login,
          email,
          avatarUrl: avatar_url,
        },
        { upsert: true, new: true },
      );

      // 4. JWT 토큰 발급
      const payload = { sub: user._id.toString(), username: user.username };

      const { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } =
        process.env as {
          JWT_SECRET: string;
          JWT_EXPIRES_IN: string;
          JWT_REFRESH_EXPIRES_IN: string;
        };

      if (!JWT_SECRET || !JWT_EXPIRES_IN || !JWT_REFRESH_EXPIRES_IN) {
        throw new Error('JWT 설정이 누락되었습니다. .env 파일을 확인하세요.');
      }

      const { accessToken, refreshToken } = this.generateToken(payload);

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
          id: user._id,
          username: user.username,
          avatarUrl: user.avatarUrl,
        },
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'GitHub 로그인 중 오류가 발생했습니다',
      );
    }
  }
}
