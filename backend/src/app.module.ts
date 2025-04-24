import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ExecutionModule } from './modules/execution/execution.module';

@Module({
  imports: [ExecutionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
