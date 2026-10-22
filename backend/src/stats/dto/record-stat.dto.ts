import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsUUID } from 'class-validator';
import { StatType } from '@prisma/client';

export class RecordStatDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID()
  photoId!: string;

  @ApiProperty({ enum: Object.values(StatType), example: StatType.VIEW })
  @IsIn(Object.values(StatType))
  type!: StatType;
}
