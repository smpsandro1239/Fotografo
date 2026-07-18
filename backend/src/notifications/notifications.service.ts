import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from './enums/notification.enums';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        title: dto.title,
        message: dto.message,
        type: dto.type || NotificationType.INFO,
        data: dto.data,
      },
    });
  }

  async createForUsers(userIds: string[], dto: Omit<CreateNotificationDto, 'userId'>) {
    return this.prisma.notification.createMany({
      data: userIds.map(userId => ({
        userId,
        title: dto.title,
        message: dto.message,
        type: dto.type || NotificationType.INFO,
        data: dto.data,
      })),
    });
  }

  async findAllByUser(userId: string, unreadOnly = false, page = 1, limit = 20) {
    const where = { userId, ...(unreadOnly && { read: false }) };
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { notifications, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({ where: { userId, read: false } });
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== userId) throw new ForbiddenException();

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async delete(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== userId) throw new ForbiddenException();

    return this.prisma.notification.delete({ where: { id: notificationId } });
  }

  // Convenience methods for common notification types
  async notifyPaymentSuccess(userId: string, reservationName?: string) {
    return this.create({
      userId,
      title: 'Pagamento Confirmado',
      message: reservationName
        ? `O pagamento para "${reservationName}" foi processado com sucesso.`
        : 'O seu pagamento foi processado com sucesso.',
      type: NotificationType.PAYMENT_SUCCEEDED,
      data: { event: 'payment_succeeded', reservationName },
    });
  }

  async notifyPaymentFailed(userId: string, reason: string) {
    return this.create({
      userId,
      title: 'Pagamento Falhou',
      message: `O seu pagamento falhou: ${reason}. Por favor, tente novamente.`,
      type: NotificationType.PAYMENT_FAILED,
      data: { event: 'payment_failed', reason },
    });
  }

  async notifyReservationConfirmed(userId: string, eventName: string) {
    return this.create({
      userId,
      title: 'Reserva Confirmada',
      message: `A sua reserva para "${eventName}" foi confirmada!`,
      type: NotificationType.RESERVATION_CONFIRMED,
      data: { event: 'reservation_confirmed', eventName },
    });
  }

  async notifyNewReservation(photographerId: string, eventName: string, clientName: string) {
    return this.create({
      userId: photographerId,
      title: 'Nova Reserva',
      message: `${clientName} reservou o seu evento "${eventName}".`,
      type: NotificationType.RESERVATION_CONFIRMED,
      data: { event: 'new_reservation', eventName, clientName },
    });
  }

  async notifyOrderCreated(userId: string, orderId: string) {
    return this.create({
      userId,
      title: 'Encomenda Criada',
      message: `A sua encomenda #${orderId.slice(-8)} foi criada com sucesso.`,
      type: NotificationType.ORDER_CREATED,
      data: { event: 'order_created', orderId },
    });
  }

  async notifyOrderCompleted(userId: string, orderId: string) {
    return this.create({
      userId,
      title: 'Encomenda Concluída',
      message: `A sua encomenda #${orderId.slice(-8)} foi concluída e está pronta para envio.`,
      type: NotificationType.ORDER_COMPLETED,
      data: { event: 'order_completed', orderId },
    });
  }

  async notifyOrderShipped(userId: string, orderId: string, trackingNumber?: string) {
    return this.create({
      userId,
      title: 'Encomenda Enviada',
      message: `A sua encomenda #${orderId.slice(-8)} foi enviada.${trackingNumber ? ` Tracking: ${trackingNumber}` : ''}`,
      type: NotificationType.ORDER_SHIPPED,
      data: { event: 'order_shipped', orderId, trackingNumber },
    });
  }

  async notifyGalleryPublished(userId: string, eventName: string, galleryUrl: string) {
    return this.create({
      userId,
      title: 'Galeria Publicada',
      message: `A galeria do evento "${eventName}" está agora disponível.`,
      type: NotificationType.GALLERY_PUBLISHED,
      data: { event: 'gallery_published', eventName, galleryUrl },
    });
  }

  async notifyPhotoSelected(photographerId: string, eventName: string, photoCount: number) {
    return this.create({
      userId: photographerId,
      title: 'Fotos Selecionadas',
      message: `O cliente selecionou ${photoCount} fotos do evento "${eventName}".`,
      type: NotificationType.GALLERY_PUBLISHED,
      data: { event: 'photos_selected', eventName, photoCount },
    });
  }

  async notifySystemMaintenance(userId: string, message: string) {
    return this.create({
      userId,
      title: 'Manutenção Agendada',
      message,
      type: NotificationType.WARNING,
      data: { event: 'system_maintenance' },
    });
  }
}