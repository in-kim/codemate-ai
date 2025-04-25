import { Controller, Post, Body } from '@nestjs/common';
import { ReviewService } from './review.service';
import { RequestReviewDto } from './dto/request-review.dto';
import { ResponseHelper } from 'src/shared/utils/response.helper';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async requestReview(
    @Body() dto: RequestReviewDto,
  ): Promise<
    | ReturnType<typeof ResponseHelper.success>
    | ReturnType<typeof ResponseHelper.fail>
  > {
    return this.reviewService.generateReview(dto.language, dto.code);
  }
}
