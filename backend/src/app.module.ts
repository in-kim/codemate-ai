import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ExecutionModule } from './modules/execution/execution.module';
import { ReviewModule } from './modules/review/review.module';

@Module({
  imports: [ExecutionModule, ReviewModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
