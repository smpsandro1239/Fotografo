import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import { OrderItemType, OrderStatus } from './enums/order.enums';
import { PaymentType } from '../payments/enums/payment-type.enum';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private paymentsService: PaymentsService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    // Validate items and calculate total
    let total = 0;
    const validatedItems = [];

    for (const item of dto.items) {
      const validatedItem = await this.validateOrderItem(item);
      total += validatedItem.unitPrice * validatedItem.quantity;
      validatedItems.push(validatedItem);
    }

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        status: OrderStatus.PENDING,
        items: {
          create: validatedItems.map(item => ({
            type: item.type,
            referenceId: item.referenceId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            options: item.options ? JSON.parse(item.options) : null,
          })),
        },
      },
      include: { items: true },
    });

    return order;
  }

  private async validateOrderItem(item: CreateOrderItemDto) {
    switch (item.type) {
      case OrderItemType.PHOTO:
        const photo = await this.prisma.photo.findUnique({ where: { id: item.referenceId } });
        if (!photo) throw new NotFoundException(`Photo ${item.referenceId} not found`);
        break;
      case OrderItemType.ALBUM:
        const album = await this.prisma.album.findUnique({ where: { id: item.referenceId } });
        if (!album) throw new NotFoundException(`Album ${item.referenceId} not found`);
        break;
      case OrderItemType.PACK:
        const pack = await this.prisma.pack.findUnique({ where: { id: item.referenceId } });
        if (!pack) throw new NotFoundException(`Pack ${item.referenceId} not found`);
        break;
    }
    return item;
  }

  async findAll(userId: string, role: string) {
    if (role === 'PHOTOGRAPHER') {
      const photographer = await this.prisma.photographer.findUnique({ where: { userId } });
      if (!photographer) throw new ForbiddenException();

      return this.prisma.order.findMany({
        where: {
          items: {
            some: {
              OR: [
                { referenceId: { in: (await this.getPhotographerPhotoIds(photographer.id)) } },
              ],
            },
          },
        },
        include: { items: true, user: { select: { name: true, email: true } }, payment: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true, payment: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async getPhotographerPhotoIds(photographerId: string): Promise<string[]> {
    const events = await this.prisma.event.findMany({
      where: { photographerId },
      select: { id: true },
    });
    const eventIds = events.map(e => e.id);
    const albums = await this.prisma.album.findMany({
      where: { eventId: { in: eventIds } },
      select: { id: true },
    });
    const albumIds = albums.map(a => a.id);
    const photos = await this.prisma.photo.findMany({
      where: { albumId: { in: albumIds } },
      select: { id: true },
    });
    return photos.map(p => p.id);
  }

  async findOne(id: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true, user: { select: { name: true, email: true } }, payment: true },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (role !== 'PHOTOGRAPHER' && order.userId !== userId) {
      throw new ForbiddenException('Not your order');
    }

    return order;
  }

  async updateStatus(id: string, userId: string, status: string) {
    const order = await this.findOne(id, userId, 'PHOTOGRAPHER');
    
    const validTransitions: Record<string, string[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.COMPLETED, OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.COMPLETED],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw new BadRequestException(`Cannot transition from ${order.status} to ${status}`);
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
      include: { items: true },
    });
  }

  async cancel(userId: string, orderId: string) {
    const order = await this.findOne(orderId, userId, 'CLIENT');
    
    if (![OrderStatus.PENDING, OrderStatus.PROCESSING].includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled');
    }

    if (order.payment?.status === 'SUCCEEDED') {
      throw new BadRequestException('Cannot cancel paid order, request refund instead');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  async createPaymentIntent(userId: string, orderId: string) {
    const order = await this.findOne(orderId, userId, 'CLIENT');
    
    if (order.payment) {
      throw new BadRequestException('Payment already exists');
    }

    return this.paymentsService.createPaymentIntentForOrder(userId, orderId, order.total);
  }

  async getOrderStats(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: true, payment: true },
    });

    return {
      totalOrders: orders.length,
      totalSpent: orders
        .filter(o => o.payment?.status === 'SUCCEEDED')
        .reduce((sum, o) => sum + o.total, 0),
      pendingOrders: orders.filter(o => o.status === 'PENDING').length,
      completedOrders: orders.filter(o => o.status === 'COMPLETED').length,
    };
  }
}