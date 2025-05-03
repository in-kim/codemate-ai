import mongoose from 'mongoose';
import { Code } from '../models/code.model';
import { User } from '../models/user.model';
import { CodeHistory } from '../models/code-history.model';

const MONGO_URI = 'mongodb://localhost:27017/code-mate';

async function seedCodeHistory() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB 연결 완료');

  const user = await User.findOne({ username: 'in-kim' });
  const code = await Code.findOne({ fileName: 'main.ts' });

  if (!user || !code) {
    console.error('❌ 사용자나 코드 문서를 찾을 수 없습니다.');
    process.exit(1);
  }

  const history = await CodeHistory.create({
    codeId: code._id,
    userId: user._id,
    snapshot: code.content, // 현재 코드 내용 스냅샷 저장
  });

  console.log('✅ 코드 히스토리 저장 완료:', history);

  await mongoose.disconnect();
}

seedCodeHistory();
