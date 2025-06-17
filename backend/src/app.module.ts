import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ReviewModule } from './modules/review/review.module';
import { AuthModule } from './modules/auth/auth.module';
import { LanguageModule } from './modules/language/language.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { CodeModule } from './modules/code/code.module';
import { EventModule } from './shared/events/event.module';

// 환경 변수 파일 경로 결정
const envFilePath =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
console.log(`환경 변수 파일 로드 중: ${envFilePath}`);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        console.log('📦 MongoDB 연결 시도 중...');
        return {
          uri: process.env.MONGO_URI,
        };
      },
    }),
    EventModule,
    ReviewModule,
    AuthModule,
    LanguageModule,
    WorkspaceModule,
    CodeModule,
  ],
})
export class AppModule {}
