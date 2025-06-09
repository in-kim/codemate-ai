import { Controller, Post, Body } from '@nestjs/common';
import { ReviewService } from './review.service';
import { RequestReviewDto } from './dto/request-review.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ICodeReview } from 'src/models/code-review.model';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('Review')
@Controller('/api/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: '코드 리뷰 요청' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 200, description: '리뷰 요청 성공' })
  async requestReview(
    @Body() reviewRequest: RequestReviewDto,
  ): Promise<ICodeReview> {
    return await this.reviewService.generateReview(
      reviewRequest.language,
      reviewRequest.code,
      reviewRequest.userId,
      reviewRequest.codeId,
    );
  }
}
