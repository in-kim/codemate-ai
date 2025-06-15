FROM node:22-alpine

WORKDIR /app

# 빌드 시 환경변수 받기
ARG FRONTEND_URL

# 환경변수 설정
ENV FRONTEND_URL=$FRONTEND_URL

COPY . .
RUN npm install
RUN npm run build
EXPOSE 4001

# 프로덕션 환경으로 실행
CMD ["npm", "run", "start:prod"]
