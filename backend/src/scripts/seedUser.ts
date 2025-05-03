import mongoose from 'mongoose';
import { User } from '../models/user.model';

/**
 * 사용자 생성 Seed
 * 데이터베이스에 사용자 정보를 추가하는 함수
 */
export async function seedUser() {
  await mongoose.connect(
    process.env.MONGO_URI || 'mongodb://localhost:27017/code-mate-user',
  );
  const user = await User.create([
    {
      githubId: 'ehddls960617@naver.com',
      username: 'in-kim',
      email: 'ehddls960617@naver.com',
    },
    {
      githubId: 'ehddls960617@gmail.com',
      username: 'KimDongIn',
      email: 'ehddls960617@gmail.com',
    },
  ]);

  console.log('🙋‍♂️ 사용자 생성됨:', user);
}

seedUser();
