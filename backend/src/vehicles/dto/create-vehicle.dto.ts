import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'uuid-v4-pack-id' })
  @IsUUID()
  @IsNotEmpty()
  packId: string;

  @ApiProperty({ example: 'Carrinho de Bebé Vintage' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Ideal para sessões de recém-nascidos', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  available?: boolean;
}
