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

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, PhotographersModule, EventsModule, AlbumsModule, PhotosModule, StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
