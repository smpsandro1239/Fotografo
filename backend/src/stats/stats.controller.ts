import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { RecordStatDto } from './dto/record-stat.dto';

@ApiTags('Estatísticas')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Post('record')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Registar estatística de uma foto (VIEW/FAVORITE/DOWNLOAD/SHARE)',
  })
  record(@Body() dto: RecordStatDto) {
    return this.statsService.recordStat(dto.photoId, dto.type);
  }

  @Get('aggregates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Estatísticas agregadas por papel (photographer/admin)',
  })
  aggregates(@GetUser('id') userId: string, @GetUser('role') role: string) {
    return this.statsService.getAggregates(userId, role);
  }

  @Get('photo/:photoId')
  @ApiOperation({ summary: 'Estatísticas de uma foto' })
  photoStats(@Param('photoId') photoId: string) {
    return this.statsService.getPhotoStats(photoId);
  }
}
