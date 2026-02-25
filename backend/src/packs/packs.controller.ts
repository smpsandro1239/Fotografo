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
import { PacksService } from './packs.service';
import { CreatePackDto } from './dto/create-pack.dto';
import { UpdatePackDto } from './dto/update-pack.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Packs')
@Controller('packs')
export class PacksController {
  constructor(private readonly packsService: PacksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new pack' })
  @ApiResponse({ status: 201, description: 'The pack has been successfully created.' })
  create(@GetUser('id') userId: string, @Body() createPackDto: CreatePackDto) {
    return this.packsService.create(userId, createPackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all packs' })
  @ApiResponse({ status: 200, description: 'Return all packs.' })
  findAll(@Query('photographerId') photographerId?: string) {
    return this.packsService.findAll(photographerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific pack' })
  @ApiResponse({ status: 200, description: 'Return the pack.' })
  @ApiResponse({ status: 404, description: 'Pack not found.' })
  findOne(@Param('id') id: string) {
    return this.packsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a pack' })
  @ApiResponse({ status: 200, description: 'The pack has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Pack not found.' })
  update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updatePackDto: UpdatePackDto,
  ) {
    return this.packsService.update(id, userId, updatePackDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a pack' })
  @ApiResponse({ status: 200, description: 'The pack has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Pack not found.' })
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.packsService.remove(id, userId);
  }
}
