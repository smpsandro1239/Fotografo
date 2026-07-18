import { IsEnum, IsNumber, IsOptional, IsString, Min, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentType } from './enums/payment-type.enum';

export class CreatePaymentIntentDto {
  @ApiProperty({ enum: PaymentType, description: 'Type of payment' })
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty({ description: 'Amount in cents (e.g., 15000 = 150.00 EUR)' })
  @IsNumber()
  @Min(50)
  amount: number;

  @ApiPropertyOptional({ description: 'Currency (default: EUR)' })
  @IsOptional()
  @IsString()
  currency?: string = 'eur';

  @ApiPropertyOptional({ description: 'Reservation ID (required for RESERVATION type)' })
  @ValidateIf((o) => o.type === PaymentType.RESERVATION)
  @IsOptional()
  @IsString()
  reservationId?: string;

  @ApiPropertyOptional({ description: 'Order ID (required for ORDER type)' })
  @ValidateIf((o) => o.type === PaymentType.ORDER)
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, string>;
}