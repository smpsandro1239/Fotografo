import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Albums')
@Controller('albums')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new album for an event' })
  @ApiResponse({ status: 201, description: 'The album has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@GetUser('id') userId: string, @Body() createAlbumDto: CreateAlbumDto) {
    return this.albumsService.create(userId, createAlbumDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all albums for a specific event' })
  @ApiResponse({ status: 200, description: 'Return all albums for the event.' })
  findAllByEvent(@Query('eventId') eventId: string, @GetUser('id') userId: string) {
    return this.albumsService.findAllByEvent(eventId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific album' })
  @ApiResponse({ status: 200, description: 'Return the album.' })
  @ApiResponse({ status: 404, description: 'Album not found.' })
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.albumsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an album' })
  @ApiResponse({ status: 200, description: 'The album has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Album not found.' })
  update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumsService.update(id, userId, updateAlbumDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an album' })
  @ApiResponse({ status: 200, description: 'The album has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Album not found.' })
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.albumsService.remove(id, userId);
  }
}
