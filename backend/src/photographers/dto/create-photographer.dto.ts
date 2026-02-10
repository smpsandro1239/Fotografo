import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePhotographerDto {
  @ApiProperty({ example: 'Especialista em casamentos e eventos corporativos.', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'https://johndoe.com', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ example: 'https://behance.net/johndoe', required: false })
  @IsOptional()
  @IsUrl()
  portfolio?: string;
}
