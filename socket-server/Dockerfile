FROM node:22-alpine

WORKDIR /app

# 환경 변수 설정
ENV NODE_ENV=production

COPY . .
RUN npm install
EXPOSE 4001

# 프로덕션 환경으로 실행
CMD ["npm", "run", "start:prod"]
