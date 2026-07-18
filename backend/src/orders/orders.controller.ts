import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Orders')
@Controller('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order with items' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async create(@CurrentUser() user: User, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders for the authenticated user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@CurrentUser() user: User, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.ordersService.findAll(user.id, user.role);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get order statistics for the user' })
  @ApiResponse({ status: 200, description: 'Order statistics' })
  async getStats(@CurrentUser() user: User) {
    return this.ordersService.getOrderStats(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order details' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.findOne(id, user.id, user.role);
  }

  @Post(':id/payment-intent')
  @ApiOperation({ summary: 'Create PaymentIntent for an order' })
  @ApiResponse({ status: 201, description: 'Payment intent created' })
  async createPaymentIntent(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.createPaymentIntent(user.id, id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (photographer only)' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  async updateStatus(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateStatus(id, user.id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order cancelled' })
  async cancel(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.cancel(user.id, id);
  }
}