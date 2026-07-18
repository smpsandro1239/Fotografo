import { Controller, Get, Query, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Stats')
@Controller('stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('photographer')
  @ApiOperation({ summary: 'Get statistics for the authenticated photographer' })
  @ApiQuery({ name: 'period', required: false, enum: ['week', 'month', 'year'] })
  @ApiResponse({ status: 200, description: 'Photographer statistics' })
  async getPhotographerStats(
    @CurrentUser() user: User,
    @Query('period') period: 'week' | 'month' | 'year' = 'month',
  ) {
    const photographer = await this.statsService['prisma'].photographer.findUnique({
      where: { userId: user.id },
    });
    if (!photographer) return { message: 'Not a photographer' };

    return this.statsService.getPhotographerStats(photographer.id, period);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get statistics for a specific event' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'Event statistics' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async getEventStats(
    @CurrentUser() user: User,
    @Param('eventId') eventId: string,
  ) {
    const event = await this.statsService['prisma'].event.findUnique({
      where: { id: eventId },
      include: { photographer: true },
    });
    if (!event) throw new Error('Event not found');

    const isPhotographer = event.photographer.userId === user.id;
    const hasReservation = !isPhotographer && await this.statsService['prisma'].reservation.findFirst({
      where: { eventId, userId: user.id, status: 'CONFIRMED' },
    });

    if (!isPhotographer && !hasReservation) {
      throw new Error('Access denied');
    }

    return this.statsService.getEventStats(eventId);
  }

  @Get('photo/:photoId')
  @ApiOperation({ summary: 'Get statistics for a specific photo' })
  @ApiParam({ name: 'photoId', description: 'Photo ID' })
  @ApiResponse({ status: 200, description: 'Photo statistics' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  async getPhotoStats(@Param('photoId') photoId: string) {
    return this.statsService.getPhotoStats(photoId);
  }

  @Get('client')
  @ApiOperation({ summary: 'Get statistics for the authenticated client' })
  @ApiResponse({ status: 200, description: 'Client statistics' })
  async getClientStats(@CurrentUser() user: User) {
    return this.statsService.getClientStats(user.id);
  }

  @Post('record')
  @ApiOperation({ summary: 'Record a stat event (view, favorite, download, share)' })
  @ApiBody({ schema: { properties: { photoId: { type: 'string' }, type: { type: 'string', enum: ['view', 'favorite', 'download', 'share'] } } } })
  @ApiResponse({ status: 201, description: 'Stat recorded' })
  async recordStat(
    @Body() body: { photoId: string; type: 'view' | 'favorite' | 'download' | 'share' },
  ) {
    return this.statsService.recordStat(body.photoId, body.type);
  }
}