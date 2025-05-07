import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ExecutionModule } from './modules/execution/execution.module';
import { ReviewModule } from './modules/review/review.module';
import { AuthModule } from './modules/auth/auth.module';

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
  ],
})
export class AppModule {}
