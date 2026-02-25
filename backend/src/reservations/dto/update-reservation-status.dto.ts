import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReservationStatus } from '@prisma/client';

export class UpdateReservationStatusDto {
  @ApiProperty({ enum: ['PENDING', 'CONFIRMED', 'CANCELLED'] })
  @IsEnum(['PENDING', 'CONFIRMED', 'CANCELLED'])
  @IsNotEmpty()
  status: ReservationStatus;
}
