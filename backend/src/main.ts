import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Atrás de proxy (Vercel/nginx/Cloudflare) o Throttler precisa do IP real
  // do header X-Forwarded-For; activado via env TRUST_PROXY=true
  if ((process.env.TRUST_PROXY ?? 'false') === 'true') {
    app.set('trust proxy', 1);
  }

  // Segurança: headers defensivos (CSP desactivada para Swagger UI)
  app.use(helmet({ contentSecurityPolicy: false }));

  // Raw body necessário para verificação de assinatura do webhook Stripe
  app.use(
    json({
      verify: (req, _res, buf) => {
        Object.assign(req, { rawBody: buf });
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS restrito por lista de origens (NUNCA reflecte a origin pedida)
  const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origem não permitida por CORS'));
      }
    },
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Plataforma Premium para Fotógrafos')
    .setDescription('API documentation for the Premium Photography Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
// Arranque da aplicação — erros de bootstrap ficam visíveis na consola
void bootstrap().catch((err) => {
  console.error('Falha ao arrancar o servidor:', err);
  process.exit(1);
});
