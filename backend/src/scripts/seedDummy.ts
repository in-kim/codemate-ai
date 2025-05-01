import mongoose from 'mongoose';
import { CodeDocument } from '../models/codeDocument';

const MONGO_URI = 'mongodb://localhost:27017/code-mate';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('📦 DB 연결됨');

  await CodeDocument.deleteMany({}); // 기존 데이터 초기화

  await CodeDocument.insertMany([
    {
      userId: 'dongin',
      fileName: 'main.ts',
      content: 'console.log("Hello, world!")',
      isSaved: false,
    },
    {
      userId: 'dongin',
      fileName: 'utils.ts',
      content: 'export const add = (a, b) => a + b;',
      isSaved: true,
    },
  ]);

  console.log('✅ 더미 데이터 삽입 완료');
  await mongoose.disconnect();
}

seed();
