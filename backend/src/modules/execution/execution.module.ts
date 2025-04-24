// src/modules/execution/execution.module.ts
import { Module } from '@nestjs/common';
import { ExecutionController } from './execution.controller';
import { ExecutionService } from './execution.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [ExecutionController],
  providers: [ExecutionService],
  imports: [SharedModule],
})
export class ExecutionModule {}
