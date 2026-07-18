import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { NotificationsService } from '../../src/notifications/notifications.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotificationType } from '../../src/notifications/enums/notification.enums';
import { CreateNotificationDto } from '../../src/notifications/dto/create-notification.dto';

const mockPrismaService = {
  notification: {
    create: jest.fn(),
    createMany: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  },
};

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prismaService: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    prismaService = module.get(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto: CreateNotificationDto = {
      userId: 'user-123',
      title: 'Test Notification',
      message: 'This is a test message',
      type: NotificationType.INFO,
      data: { key: 'value' },
    };

    it('should create notification successfully', async () => {
      const expectedNotification = { id: 'notif-1', ...dto, read: false, createdAt: new Date() };
      prismaService.notification.create.mockResolvedValue(expectedNotification);

      const result = await service.create(dto);

      expect(prismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          title: 'Test Notification',
          message: 'This is a test message',
          type: NotificationType.INFO,
          data: { key: 'value' },
        },
      });
      expect(result).toEqual(expectedNotification);
    });

    it('should default type to INFO if not provided', async () => {
      const dtoWithoutType = { ...dto, type: undefined };
      prismaService.notification.create.mockResolvedValue({ id: 'notif-1', ...dtoWithoutType, type: NotificationType.INFO });

      const result = await service.create(dtoWithoutType);

      expect(prismaService.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ type: NotificationType.INFO }) })
      );
    });
  });

  describe('createForUsers', () => {
    it('should create notifications for multiple users', async () => {
      const userIds = ['user-1', 'user-2', 'user-3'];
      const dto = { title: 'Broadcast', message: 'Hello all', type: NotificationType.SUCCESS };

      prismaService.notification.createMany.mockResolvedValue({ count: 3 });

      const result = await service.createForUsers(userIds, dto);

      expect(prismaService.notification.createMany).toHaveBeenCalledWith({
        data: userIds.map(userId => ({ userId, ...dto, type: NotificationType.SUCCESS })),
      });
      expect(result).toEqual({ count: 3 });
    });
  });

  describe('findAllByUser', () => {
    const userId = 'user-123';

    it('should return paginated notifications with total count', async () => {
      const notifications = [
        { id: '1', userId, title: 'Notif 1', message: 'Msg 1', read: false, createdAt: new Date() },
        { id: '2', userId, title: 'Notif 2', message: 'Msg 2', read: true, createdAt: new Date() },
      ];

      prismaService.notification.findMany.mockResolvedValue(notifications);
      prismaService.notification.count.mockResolvedValue(2);

      const result = await service.findAllByUser(userId, false, 1, 10);

      expect(result.notifications).toEqual(notifications);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('should filter unread only when requested', async () => {
      prismaService.notification.findMany.mockResolvedValue([]);
      prismaService.notification.count.mockResolvedValue(0);

      await service.findAllByUser(userId, true, 1, 10);

      expect(prismaService.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId, read: false } })
      );
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count', async () => {
      prismaService.notification.count.mockResolvedValue(5);

      const result = await service.getUnreadCount('user-123');

      expect(prismaService.notification.count).toHaveBeenCalledWith({ where: { userId: 'user-123', read: false } });
      expect(result).toBe(5);
    });
  });

  describe('markAsRead', () => {
    const userId = 'user-123';
    const notificationId = 'notif-123';

    it('should mark notification as read for owner', async () => {
      const notification = { id: notificationId, userId, read: false };
      prismaService.notification.findUnique.mockResolvedValue(notification);
      prismaService.notification.update.mockResolvedValue({ ...notification, read: true });

      const result = await service.markAsRead(userId, notificationId);

      expect(prismaService.notification.findUnique).toHaveBeenCalledWith({ where: { id: notificationId } });
      expect(prismaService.notification.update).toHaveBeenCalledWith({
        where: { id: notificationId },
        data: { read: true },
      });
      expect(result.read).toBe(true);
    });

    it('should throw NotFoundException if notification not found', async () => {
      prismaService.notification.findUnique.mockResolvedValue(null);

      await expect(service.markAsRead(userId, notificationId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if notification belongs to another user', async () => {
      prismaService.notification.findUnique.mockResolvedValue({ id: notificationId, userId: 'other-user' });

      await expect(service.markAsRead(userId, notificationId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all unread notifications as read', async () => {
      prismaService.notification.updateMany.mockResolvedValue({ count: 3 });

      const result = await service.markAllAsRead('user-123');

      expect(prismaService.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-123', read: false },
        data: { read: true },
      });
      expect(result).toEqual({ count: 3 });
    });
  });

  describe('delete', () => {
    const userId = 'user-123';
    const notificationId = 'notif-123';

    it('should delete notification for owner', async () => {
      prismaService.notification.findUnique.mockResolvedValue({ id: notificationId, userId });
      prismaService.notification.delete.mockResolvedValue({ id: notificationId });

      const result = await service.delete(userId, notificationId);

      expect(prismaService.notification.delete).toHaveBeenCalledWith({ where: { id: notificationId } });
    });

    it('should throw NotFoundException if notification not found', async () => {
      prismaService.notification.findUnique.mockResolvedValue(null);

      await expect(service.delete(userId, notificationId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if notification belongs to another user', async () => {
      prismaService.notification.findUnique.mockResolvedValue({ id: notificationId, userId: 'other-user' });

      await expect(service.delete(userId, notificationId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Convenience methods', () => {
    it('should create payment success notification', async () => {
      prismaService.notification.create.mockResolvedValue({ id: 'notif-1' });

      await service.notifyPaymentSuccess('user-123', 'Wedding Event');

      expect(prismaService.notification.create).toHaveBeenCalledWith({
        userId: 'user-123',
        title: 'Pagamento Confirmado',
        message: 'O pagamento para "Wedding Event" foi processado com sucesso.',
        type: NotificationType.PAYMENT_SUCCEEDED,
        data: { event: 'payment_succeeded', reservationName: 'Wedding Event' },
      });
    });

    it('should create reservation confirmed notification', async () => {
      prismaService.notification.create.mockResolvedValue({ id: 'notif-1' });

      await service.notifyReservationConfirmed('user-123', 'Wedding Event');

      expect(prismaService.notification.create).toHaveBeenCalledWith({
        userId: 'user-123',
        title: 'Reserva Confirmada',
        message: 'A sua reserva para "Wedding Event" foi confirmada!',
        type: NotificationType.RESERVATION_CONFIRMED,
        data: { event: 'reservation_confirmed', eventName: 'Wedding Event' },
      });
    });

    it('should create new reservation notification for photographer', async () => {
      prismaService.notification.create.mockResolvedValue({ id: 'notif-1' });

      await service.notifyNewReservation('photographer-1', 'Wedding Event', 'John Doe');

      expect(prismaService.notification.create).toHaveBeenCalledWith({
        userId: 'photographer-1',
        title: 'Nova Reserva',
        message: 'John Doe reservou o seu evento "Wedding Event".',
        type: NotificationType.RESERVATION_CONFIRMED,
        data: { event: 'new_reservation', eventName: 'Wedding Event', clientName: 'John Doe' },
      });
    });

    it('should create order notifications', async () => {
      prismaService.notification.create.mockResolvedValue({ id: 'notif-1' });

      await service.notifyOrderCreated('user-123', 'order-123');
      expect(prismaService.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: NotificationType.ORDER_CREATED, data: expect.objectContaining({ event: 'order_created' }) })
      );

      await service.notifyOrderCompleted('user-123', 'order-123');
      expect(prismaService.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: NotificationType.ORDER_COMPLETED })
      );

      await service.notifyOrderShipped('user-123', 'order-123', 'TRACK123');
      expect(prismaService.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: NotificationType.ORDER_SHIPPED, data: expect.objectContaining({ trackingNumber: 'TRACK123' }) })
      );
    });

    it('should create gallery notifications', async () => {
      prismaService.notification.create.mockResolvedValue({ id: 'notif-1' });

      await service.notifyGalleryPublished('user-123', 'Wedding Event', 'https://gallery.com/event-1');
      expect(prismaService.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: NotificationType.GALLERY_PUBLISHED, data: expect.objectContaining({ galleryUrl: 'https://gallery.com/event-1' }) })
      );

      await service.notifyPhotoSelected('photographer-1', 'Wedding Event', 25);
      expect(prismaService.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: NotificationType.GALLERY_PUBLISHED, data: expect.objectContaining({ photoCount: 25 }) })
      );
    });

    it('should create system maintenance notification', async () => {
      prismaService.notification.create.mockResolvedValue({ id: 'notif-1' });

      await service.notifySystemMaintenance('user-123', 'Server maintenance on Sunday');

      expect(prismaService.notification.create).toHaveBeenCalledWith({
        userId: 'user-123',
        title: 'Manutenção Agendada',
        message: 'Server maintenance on Sunday',
        type: NotificationType.WARNING,
        data: { event: 'system_maintenance' },
      });
    });
  });
});