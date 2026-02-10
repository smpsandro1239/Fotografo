import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Reservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reservation for an event' })
  @ApiResponse({ status: 201, description: 'The reservation has been successfully created.' })
  create(@GetUser('id') userId: string, @Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(userId, createReservationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reservations for the current user' })
  @ApiResponse({ status: 200, description: 'Return all reservations.' })
  findAll(@GetUser('id') userId: string, @GetUser('role') role: string) {
    return this.reservationsService.findAll(userId, role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific reservation' })
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.reservationsService.findOne(id, userId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update reservation status (Photographer only)' })
  updateStatus(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updateDto: UpdateReservationStatusDto,
  ) {
    return this.reservationsService.updateStatus(id, userId, updateDto);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a reservation (Client only)' })
  cancel(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.reservationsService.cancel(id, userId);
  }
}
