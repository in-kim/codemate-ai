import { Module } from '@nestjs/common';
import { VertexAiService } from './vertex.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [VertexAiService],
  exports: [VertexAiService], // 다른 모듈에서 사용 가능하게
})
export class VertexModule {}
