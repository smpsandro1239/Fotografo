import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

// Transições de estado válidas para encomendas
const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [
    OrderStatus.COMPLETED,
    OrderStatus.SHIPPED,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.SHIPPED]: [],
  [OrderStatus.CANCELLED]: [],
};

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const total = dto.items.reduce(
      (sum, item) => sum + item.price * (item.quantity ?? 1),
      0,
    );

    return this.prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: dto.items.map((i) => ({
            type: i.type,
            referenceId: i.referenceId,
            name: i.name,
            price: i.price,
            quantity: i.quantity ?? 1,
          })),
        },
      },
      include: { items: true },
    });
  }

  async findAll(userId: string, role: string) {
    // ADMIN vê tudo; CLIENT vê as suas; PHOTOGRAPHER vê encomendas dos seus eventos não tem sentido direto — mostra as suas próprias
    if (role === UserRole.ADMIN) {
      return this.prisma.order.findMany({
        include: { items: true, user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      });
    }
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true, payment: true },
    });
    if (!order) throw new NotFoundException(`Encomenda ${id} não encontrada`);
    if (role !== UserRole.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('Acesso negado a esta encomenda');
    }
    return order;
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
    userId: string,
    role: string,
  ) {
    if (role !== UserRole.ADMIN && role !== UserRole.PHOTOGRAPHER) {
      throw new ForbiddenException(
        'Apenas fotógrafo ou admin alteram estado de encomendas',
      );
    }
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException(`Encomenda ${id} não encontrada`);

    const allowed = ORDER_TRANSITIONS[order.status];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Transição inválida: ${order.status} -> ${dto.status}`,
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: { items: true },
    });
  }

  // Chamado pelo webhook de pagamento quando a encomenda é paga
  async markPaid(
    orderId: string,
  ): Promise<Prisma.OrderGetPayload<{ include: { items: true } }> | null> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) return null;
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PROCESSING },
      include: { items: true },
    });
  }
}
