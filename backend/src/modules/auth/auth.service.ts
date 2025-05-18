import axios from 'axios';
import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { UserDocument } from 'src/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

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
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  onModuleInit() {
    // 모듈 초기화 시 MongoDB 연결 상태 확인
    console.log(
      '⚙️ AuthService 초기화 - MongoDB 연결 상태:',
      this.connection.readyState,
    );
  }

  generateToken(payload: object): {
    accessToken: string;
    refreshToken: string;
  } {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtRefreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );

    console.log('config : ', jwtSecret, jwtRefreshExpiresIn);

    if (!jwtSecret || !jwtRefreshExpiresIn) {
      throw new Error('JWT 설정이 누락되었습니다. .env 파일을 확인하세요.');
    }

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: jwtRefreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }
  async loginWithGitHub(code: string) {
    try {
      // 1. GitHub로부터 access token 획득
      const tokenResponse = await axios.post<GitHubTokenResponse>(
        'https://github.com/login/oauth/access_token',
        {
          client_id: this.configService.get<string>('GITHUB_CLIENT_ID'),
          client_secret: this.configService.get<string>('GITHUB_CLIENT_SECRET'),
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

      // console.log('userResponse : ', userResponse.data);

      // 3. DB에 유저 정보 upsert
      const user = await this.userModel.findOneAndUpdate(
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
      const payload = {
        sub: user._id.toString(),
        username: user.username,
        avatarUrl: avatar_url,
      };

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
