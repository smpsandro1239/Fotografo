import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({ example: 'Cerimónia Relixiosa' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'uuid-v4-event-id' })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;
}
