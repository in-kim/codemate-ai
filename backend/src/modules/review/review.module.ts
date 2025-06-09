import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { SharedModule } from 'src/shared/shared.module';
import { VertexModule } from '../vertex/vertex.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CodeReviewSchema } from 'src/models/code-review.model';

@Module({
  imports: [
    SharedModule,
    VertexModule,
    MongooseModule.forFeature([
      { name: 'CodeReview', schema: CodeReviewSchema },
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
