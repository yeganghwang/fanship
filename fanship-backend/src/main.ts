import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  // 로그 디렉터리 준비
  const logsDir = path.join(__dirname, '..', 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  const logFilePath = path.join(logsDir, 'access.log');
  const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 요청 로깅 미들웨어
  app.use((req, res, next) => {
    const start = Date.now();
    const { method, url } = req;
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress;
    res.on('finish', () => {
      const duration = Date.now() - start;
      const line = `[${new Date().toISOString()}] ${ip} ${method} ${url} ${res.statusCode} ${duration}ms\n`;
      logStream.write(line);
    });
    next();
  });

  // CORS 설정 추가
  app.enableCors({
    origin: '*', // 프론트엔드 애플리케이션의 Origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 정적 파일 서빙 설정
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // Add ClassSerializerInterceptor
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();