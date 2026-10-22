import { Injectable } from '@nestjs/common';
import { NotificationType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createForUser(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: Prisma.InputJsonValue,
  ) {
    return this.prisma.notification.create({
      data: { userId, type, title, message, data },
    });
  }

  // Criação em lote — usada por payments/orders para notificar vários utilizadores
  async bulkCreate(
    items: Array<{
      userId: string;
      type: NotificationType;
      title: string;
      message: string;
      data?: Prisma.InputJsonValue;
    }>,
  ) {
    if (items.length === 0) return { count: 0 };
    const result = await this.prisma.notification.createMany({
      data: items.map((i) => ({
        userId: i.userId,
        type: i.type,
        title: i.title,
        message: i.message,
        data: i.data,
      })),
    });
    return { count: result.count };
  }

  async findAllForUser(userId: string, unreadOnly = false) {
    return this.prisma.notification.findMany({
      where: { userId, ...(unreadOnly ? { read: false } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async unreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, read: false },
    });
    return { count };
  }

  async markAsRead(id: string, userId: string) {
    // ownership check: só marca a SUA notificação
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification || notification.userId !== userId) {
      return null;
    }
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return { count: result.count };
  }
}
