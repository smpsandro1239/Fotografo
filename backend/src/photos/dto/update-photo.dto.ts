import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePhotoDto {
  @ApiProperty({ example: 'New title or metadata description', required: false })
  @IsString()
  @IsOptional()
  description?: string; // Metadata is Json, so we can refine this later
}
