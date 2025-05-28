import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CodeController } from './code.controller';
import { CodeService } from './code.service';
import { CodeHistoryService } from './code-history.service';
import { LoggerService } from 'src/shared/logger/logger.service';
import { CodeSchema } from 'src/models/code.model';
import { CodeHistorySchema } from 'src/models/code-history.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Code', schema: CodeSchema },
      { name: 'CodeHistory', schema: CodeHistorySchema },
    ]),
  ],
  controllers: [CodeController],
  providers: [CodeService, CodeHistoryService, LoggerService],
  exports: [CodeService, CodeHistoryService],
})
export class CodeModule {}
