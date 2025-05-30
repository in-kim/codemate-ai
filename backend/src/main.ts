import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './shared/exceptions/http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // 쿠키 파서 미들웨어 활성화
  app.use(cookieParser());

  // CORS 설정
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // 글로벌 인터셉터 등록
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Codemate API Docs')
    .setDescription('Codemate 플랫폼의 API 명세서입니다.')
    .setVersion('1.0')
    .addBearerAuth() // JWT 인증 헤더 추가
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // 애플리케이션 종료 시 MongoDB 연결 종료
  app.enableShutdownHooks();
  process.on('SIGINT', () => {
    void mongoose.disconnect().then(() => {
      console.log('✅ MongoDB 연결 종료');
      process.exit(0);
    });
  });

  await app.listen(process.env.PORT ?? 4000);
  console.log(
    `🚀 애플리케이션이 포트 ${process.env.PORT ?? 4000}에서 실행 중입니다.`,
  );
}

bootstrap();
