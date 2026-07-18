import { Module } from '@nestjs/common';
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
import { PaymentsModule } from './payments/payments.module';
import { OrdersModule } from './orders/orders.module';
import { StatsModule } from './stats/stats.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
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
    PaymentsModule,
    OrdersModule,
    StatsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
