import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, IsJSON } from 'class-validator';

export class CreatePhotoDto {
  @ApiProperty({ example: 'uuid-v4-album-id' })
  @IsUUID()
  @IsNotEmpty()
  albumId: string;

  @ApiProperty({ example: 'https://cdn.example.com/photos/123.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 'https://cdn.example.com/thumbnails/123.jpg', required: false })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({ example: { width: 1920, height: 1080 }, required: false })
  @IsOptional()
  metadata?: any;
}
