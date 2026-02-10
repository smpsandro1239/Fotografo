import { Module } from '@nestjs/common';
import { PhotographersService } from './photographers.service';
import { PhotographersController } from './photographers.controller';

@Module({
  providers: [PhotographersService],
  controllers: [PhotographersController]
})
export class PhotographersModule {}
