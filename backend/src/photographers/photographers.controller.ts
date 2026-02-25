import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PhotographersService } from './photographers.service';
import { CreatePhotographerDto } from './dto/create-photographer.dto';
import { UpdatePhotographerDto } from './dto/update-photographer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Photographers')
@Controller('photographers')
export class PhotographersController {
  constructor(private readonly photographersService: PhotographersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register as a photographer' })
  @ApiResponse({ status: 201, description: 'Successfully registered as a photographer' })
  create(@GetUser('id') userId: string, @Body() createPhotographerDto: CreatePhotographerDto) {
    return this.photographersService.create(userId, createPhotographerDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current photographer profile' })
  findMe(@GetUser('id') userId: string) {
    return this.photographersService.findMe(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get photographer profile by ID' })
  findOne(@Param('id') id: string) {
    return this.photographersService.findOne(id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current photographer profile' })
  update(@GetUser('id') userId: string, @Body() updatePhotographerDto: UpdatePhotographerDto) {
    return this.photographersService.update(userId, updatePhotographerDto);
  }
}
