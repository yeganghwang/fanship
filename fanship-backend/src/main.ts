import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

// 간단 민감정보 마스킹 & 트렁케이션 유틸 (main.ts 내부에만 유지)
const SENSITIVE_KEYS = ['password','pass','pwd','token','authorization','auth','secret'];
function sanitizeBody(raw: any): any {
  if (!raw || typeof raw !== 'object') return raw;
  const clone: any = Array.isArray(raw) ? [] : {};
  for (const k of Object.keys(raw)) {
    const v = (raw as any)[k];
    if (SENSITIVE_KEYS.some(s => k.toLowerCase().includes(s))) {
      clone[k] = '***';
    } else if (v && typeof v === 'object') {
      clone[k] = sanitizeBody(v);
    } else if (typeof v === 'string') {
      clone[k] = v.length > 300 ? v.slice(0,300) + '...(truncated)' : v;
    } else {
      clone[k] = v;
    }
  }
  // 전체 JSON 길이 제한
  const json = JSON.stringify(clone);
  if (json.length > 1500) return { _truncated: true };
  return clone;
}

async function bootstrap() {
  // 로그 디렉터리 준비
  const logsDir = path.join(__dirname, '..', 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  const logFilePath = path.join(logsDir, 'access.log'); // 필요시 일자별로 분리 가능
  const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 요청 로깅 (간단 / main.ts 내부만 사용) - JSON 한 줄
  app.use((req: any, res: any, next) => {
    const start = Date.now();
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress;
    res.on('finish', () => {
      try {
        const duration = Date.now() - start;
        const method = req.method;
        const url = req.originalUrl || req.url;
        const ua = req.headers['user-agent'];
        const referer = req.headers['referer'] || req.headers['referrer'];
        const status = res.statusCode;
        const bytes = res.getHeader && res.getHeader('content-length');
        let body: any = undefined;
        if (['POST','PUT','PATCH'].includes(method) && req.headers['content-type']?.includes('application/json')) {
          body = sanitizeBody(req.body);
        }
        const lineObj: any = {
          time: new Date().toISOString(),
          ip,
            method,
            url,
            status,
            durMs: duration,
            bytes: bytes ? Number(bytes) : undefined,
            ua,
            ref: referer,
            query: Object.keys(req.query || {}).length ? req.query : undefined,
            body
        };
        // 빈 키 제거
        Object.keys(lineObj).forEach(k => (lineObj[k] === undefined || (typeof lineObj[k] === 'object' && lineObj[k] && !Object.keys(lineObj[k]).length)) && delete lineObj[k]);
        logStream.write(JSON.stringify(lineObj) + '\n');
      } catch (e) {
        // 로깅 실패는 서비스 로직에 영향 주지 않도록 무시
      }
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