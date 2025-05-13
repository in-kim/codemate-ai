import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ExecutionModule } from './modules/execution/execution.module';
import { ReviewModule } from './modules/review/review.module';
import { AuthModule } from './modules/auth/auth.module';
import { LanguageModule } from './modules/language/language.module';
import { RoomModule } from './modules/room/room.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        console.log('📦 MongoDB 연결 시도 중...');
        return {
          uri: process.env.MONGO_URI,
        };
      },
    }),
    ExecutionModule,
    ReviewModule,
    AuthModule,
    LanguageModule,
    RoomModule,
  ],
})
export class AppModule {}
