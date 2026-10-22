import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: [
      OrderStatus.PROCESSING,
      OrderStatus.COMPLETED,
      OrderStatus.CANCELLED,
      OrderStatus.SHIPPED,
    ],
  })
  @IsIn([
    OrderStatus.PROCESSING,
    OrderStatus.COMPLETED,
    OrderStatus.CANCELLED,
    OrderStatus.SHIPPED,
  ])
  status!: OrderStatus;
}
