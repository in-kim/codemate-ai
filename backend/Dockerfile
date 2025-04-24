FROM node:18
# Docker CLI 설치
RUN apt-get update && apt-get install -y docker.io

WORKDIR /app

COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

# 4000번 포트 노출
EXPOSE 4000

CMD ["pnpm", "start"]  