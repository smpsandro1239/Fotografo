import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Plataforma Premium para Fotógrafos')
    .setDescription('API documentation for the Premium Photography Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Photographers', 'Photographer profiles')
    .addTag('Events', 'Event management')
    .addTag('Albums', 'Album management')
    .addTag('Photos', 'Photo upload and management')
    .addTag('Storage', 'Cloudflare R2 storage')
    .addTag('Packs', 'Photo packs')
    .addTag('Vehicles', 'Vehicles')
    .addTag('Reservations', 'Event reservations')
    .addTag('Payments', 'Stripe payments')
    .addTag('Orders', 'Photo orders')
    .addTag('Stats', 'Statistics and analytics')
    .addTag('Notifications', 'In-app notifications')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
