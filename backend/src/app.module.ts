import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ExecutionModule } from './modules/execution/execution.module';
import { ReviewModule } from './modules/review/review.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ExecutionModule,
    ReviewModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
