import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested, ArrayMinSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OrderItemType } from './enums/order.enums';

export class CreateOrderItemDto {
  @ApiProperty({ enum: OrderItemType })
  @IsEnum(OrderItemType)
  type: OrderItemType;

  @ApiProperty()
  @IsUUID()
  referenceId: string; // Photo ID, Album ID, Pack ID, etc.

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  unitPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  options?: string; // JSON string for size, paper type, etc.
}

export class CreateOrderDto {
  @ApiProperty({ type: [CreateOrderItemDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayMinSize(1)
  items: CreateOrderItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'SHIPPED'] })
  @IsEnum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'SHIPPED'])
  status: string;
}