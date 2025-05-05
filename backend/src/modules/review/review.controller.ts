import { Controller, Post, Body } from '@nestjs/common';
import { ReviewService } from './review.service';
import { RequestReviewDto } from './dto/request-review.dto';
import { ResponseHelper } from 'src/shared/utils/response.helper';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: '코드 리뷰 요청' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        language: { type: 'string', enum: ['javascript', 'python'] },
        code: { type: 'string' },
      },
      required: ['language', 'code'],
    },
  })
  @ApiResponse({ status: 200, description: '리뷰 요청 성공' })
  async requestReview(
    @Body() dto: RequestReviewDto,
  ): Promise<
    | ReturnType<typeof ResponseHelper.success>
    | ReturnType<typeof ResponseHelper.fail>
  > {
    return this.reviewService.generateReview(dto.language, dto.code);
  }
}
