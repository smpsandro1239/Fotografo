import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAlbumDto {
  @ApiProperty({ example: 'Festa e Baile' })
  @IsString()
  @IsOptional()
  name?: string;
}
