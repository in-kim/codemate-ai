// src/modules/execution/execution.module.ts
import { Module } from '@nestjs/common';
import { ExecutionController } from './execution.controller';
import { ExecutionService } from './execution.service';

@Module({
  controllers: [ExecutionController],
  providers: [ExecutionService],
})
export class ExecutionModule {}
