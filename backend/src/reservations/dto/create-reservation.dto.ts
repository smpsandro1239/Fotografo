import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: 'uuid-v4-event-id' })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;
}
