import mongoose from 'mongoose';

export async function connectMongo() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/code-mate';
  await mongoose.connect(uri);
  console.log('✅ MongoDB 연결 완료');
}
