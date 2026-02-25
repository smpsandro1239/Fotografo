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
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new vehicle for a pack' })
  @ApiResponse({ status: 201, description: 'The vehicle has been successfully created.' })
  create(@GetUser('id') userId: string, @Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(userId, createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles for a specific pack' })
  @ApiResponse({ status: 200, description: 'Return all vehicles for the pack.' })
  findAll(@Query('packId') packId: string) {
    return this.vehiclesService.findAllByPack(packId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific vehicle' })
  @ApiResponse({ status: 200, description: 'Return the vehicle.' })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiResponse({ status: 200, description: 'The vehicle has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, userId, updateVehicleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a vehicle' })
  @ApiResponse({ status: 200, description: 'The vehicle has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.vehiclesService.remove(id, userId);
  }
}
