FROM node:24-alpine

WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# 빌드 시 환경변수 받기
ARG BACKEND_API_URL
ARG GITHUB_CLIENT_ID
ARG GITHUB_REDIRECT_URI

# 환경변수 설정
ENV BACKEND_API_URL=$BACKEND_API_URL
ENV NEXT_PUBLIC_GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
ENV NEXT_PUBLIC_GITHUB_REDIRECT_URI=$GITHUB_REDIRECT_URI

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
