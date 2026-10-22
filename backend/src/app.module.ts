import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PhotographersModule } from './photographers/photographers.module';
import { EventsModule } from './events/events.module';
import { AlbumsModule } from './albums/albums.module';
import { PhotosModule } from './photos/photos.module';
import { StorageModule } from './storage/storage.module';
import { PacksModule } from './packs/packs.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ReservationsModule } from './reservations/reservations.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { StatsModule } from './stats/stats.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Rate limiting global: 100 pedidos/min por IP (override via @Throttle nos controladores)
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    PhotographersModule,
    EventsModule,
    AlbumsModule,
    PhotosModule,
    StorageModule,
    PacksModule,
    VehiclesModule,
    ReservationsModule,
    OrdersModule,
    PaymentsModule,
    StatsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Guard global de rate limiting (ThrottlerGuard) para todas as rotas
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
