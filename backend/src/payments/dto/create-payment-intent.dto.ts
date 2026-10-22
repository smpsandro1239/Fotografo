import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsUUID } from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty({ description: 'ID da reserva a pagar' })
  @IsUUID()
  reservationId!: string;

  @ApiProperty({
    required: false,
    description: 'ID da encomenda a pagar (alternativo à reserva)',
  })
  @IsOptional()
  @IsUUID()
  orderId?: string;

  @ApiProperty({ enum: ['reservation', 'order'], default: 'reservation' })
  @IsIn(['reservation', 'order'])
  target!: 'reservation' | 'order';
}
