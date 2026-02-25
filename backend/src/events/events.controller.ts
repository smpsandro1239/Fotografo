import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('public')
  @ApiOperation({ summary: 'Get all public events' })
  @ApiResponse({ status: 200, description: 'Return all public events.' })
  findPublic() {
    return this.eventsService.findPublic();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'The event has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@GetUser('id') userId: string, @Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(userId, createEventDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all events for the current photographer' })
  @ApiResponse({ status: 200, description: 'Return all events for the photographer.' })
  findAll(@GetUser('id') userId: string) {
    return this.eventsService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific event' })
  @ApiResponse({ status: 200, description: 'Return the event.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.eventsService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an event' })
  @ApiResponse({ status: 200, description: 'The event has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, userId, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({ status: 200, description: 'The event has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.eventsService.remove(id, userId);
  }
}
