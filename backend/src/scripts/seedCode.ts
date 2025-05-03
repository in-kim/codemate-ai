import mongoose from 'mongoose';
import { Code } from '../models/code.model';
import { User } from '../models/user.model';
import { nanoid } from 'nanoid/non-secure'; // roomId 생성용, non-secure 버전 사용

const MONGO_URI = 'mongodb://localhost:27017/code-mate';

async function seedCode() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB 연결 완료');

  const user = await User.findOne({ username: 'in-kim' });

  if (!user) {
    console.error('❌ 유저를 찾을 수 없습니다. 먼저 User를 시드해주세요.');
    process.exit(1);
  }

  const roomId = `room_${nanoid(8)}`;

  const code = await Code.create({
    userId: user._id,
    fileName: 'main.ts',
    content: `console.log('Hello, world!');`,
    language: 'typescript',
    roomId,
    isSaved: false,
    participants: [
      {
        userId: user._id,
        role: 'owner',
      },
    ],
  });

  console.log('✅ 코드 문서 생성 완료:', code);

  await mongoose.disconnect();
}

seedCode();
