import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { Code } from '../models/code.model';
import { CodeReview } from '../models/code-review.model';

const MONGO_URI = 'mongodb://localhost:27017/code-mate';

async function seedCodeReview() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB 연결 완료');

  const user = await User.findOne({ username: 'dongin' });
  const code = await Code.findOne({ fileName: 'main.ts' });

  if (!user || !code) {
    console.error('❌ 사용자 또는 코드 문서를 찾을 수 없습니다.');
    process.exit(1);
  }

  const review = await CodeReview.create({
    codeId: code._id,
    userId: user._id,
    summary:
      '전반적으로 코드는 잘 구성되어 있으나 변수명과 성능 측면에서 개선 여지가 있습니다.',
    suggestions: [
      {
        line: 3,
        type: 'style',
        message: '`vertexAI`는 명확하지 않음. `vertexAIClient`로 변경 권장',
      },
      {
        line: 12,
        type: 'performance',
        message:
          '`detectAndSetLanguage()` 호출이 너무 빈번합니다. debounce를 적용해보세요.',
      },
    ],
  });

  console.log('✅ 코드 리뷰 생성 완료:', review);

  await mongoose.disconnect();
}

seedCodeReview();
