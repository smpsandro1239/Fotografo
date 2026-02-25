import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Casamento Sofia & Pedro' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Casamento realizado na Quinta da Lagoa', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2024-12-31T18:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'Quinta da Lagoa, Sintra', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
