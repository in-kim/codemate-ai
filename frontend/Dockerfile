FROM node:24-alpine

WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# 의존성 파일 복사
COPY package.json pnpm-lock.yaml* ./

# 의존성 설치
RUN pnpm install

# 소스 코드 복사
COPY . .

# 앱 빌드
RUN pnpm build

# 포트 설정
EXPOSE 3000

# 앱 실행
CMD ["pnpm", "start"]
