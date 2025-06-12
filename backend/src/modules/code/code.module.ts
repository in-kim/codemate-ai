import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CodeController } from './code.controller';
import { CodeService } from './code.service';
import { CodeHistoryService } from './code-history.service';
import { CodeSchema } from 'src/models/code.model';
import { CodeHistorySchema } from 'src/models/code-history.model';
import { SharedModule } from 'src/shared/shared.module';
import { EventModule } from 'src/shared/events/event.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Code', schema: CodeSchema },
      { name: 'CodeHistory', schema: CodeHistorySchema },
    ]),
    SharedModule,
    EventModule,
  ],
  controllers: [CodeController],
  providers: [CodeService, CodeHistoryService],
  exports: [CodeService, CodeHistoryService],
})
export class CodeModule {}
