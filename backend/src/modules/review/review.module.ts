import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { SharedModule } from 'src/shared/shared.module';
import { VertexModule } from '../vertex/vertex.module';

@Module({
  imports: [SharedModule, VertexModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
