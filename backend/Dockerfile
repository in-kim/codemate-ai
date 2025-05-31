FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

# 4000번 포트 노출
EXPOSE 4000

CMD ["pnpm", "start"]  