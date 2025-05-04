// backend/scripts/seedInvite.ts
import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { Code } from '../models/code.model';
import { Invite } from '../models/invite.model';

const MONGO_URI = 'mongodb://localhost:27017/code-mate';

async function seedInvite() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB 연결 완료');

  const user = await User.findOne({ username: 'dongin' });
  const code = await Code.findOne({ fileName: 'main.ts' });

  if (!user || !code) {
    console.error('❌ 사용자 또는 코드 문서를 찾을 수 없습니다.');
    process.exit(1);
  }

  const invite = await Invite.create({
    codeId: code._id,
    inviterId: user._id,
    githubUsername: 'collab-dev',
    githubEmail: 'collab-dev@example.com',
    accepted: false,
  });

  console.log('✅ 초대 문서 생성 완료:', invite);

  await mongoose.disconnect();
}

seedInvite();
