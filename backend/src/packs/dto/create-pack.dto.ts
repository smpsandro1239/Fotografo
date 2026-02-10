import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePackDto {
  @ApiProperty({ example: 'Pack Diamante' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 499.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'Sessão completa + Album Digital + 100 fotos editadas', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
