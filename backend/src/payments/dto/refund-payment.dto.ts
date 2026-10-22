import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class RefundPaymentDto {
  @ApiProperty({
    required: false,
    description: 'Valor parcial em euros (omitir = reembolso total)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amountEur?: number;
}
