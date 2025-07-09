import { randomUUID } from 'crypto';

if (
  typeof globalThis.crypto === 'undefined' ||
  typeof (globalThis.crypto as any).randomUUID !== 'function'
) {
  if (typeof globalThis.crypto === 'undefined') {
    // @ts-ignore: we know crypto is missing, so we’re creating it
    globalThis.crypto = {};
  }
  (globalThis.crypto as any).randomUUID = (...args: any[]) => randomUUID(...args);
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',  
    credentials: true,               
    methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  });

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
