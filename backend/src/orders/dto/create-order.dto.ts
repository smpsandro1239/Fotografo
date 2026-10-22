import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemType } from '@prisma/client';

export class OrderItemInputDto {
  @ApiProperty({ enum: Object.values(OrderItemType) })
  @IsIn(Object.values(OrderItemType))
  type!: OrderItemType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 15.0 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items!: OrderItemInputDto[];
}
