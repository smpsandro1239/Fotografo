import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../common/guards/roles.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Encomendas')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar encomenda multi-item de fotos' })
  create(@GetUser('id') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar encomendas visíveis ao utilizador' })
  findAll(@GetUser('id') userId: string, @GetUser('role') role: string) {
    return this.ordersService.findAll(userId, role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe de uma encomenda' })
  findOne(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
  ) {
    return this.ordersService.findOne(id, userId, role);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PHOTOGRAPHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar estado da encomenda (fotógrafo/admin)' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
  ) {
    return this.ordersService.updateStatus(id, dto, userId, role);
  }
}
