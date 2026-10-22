import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Notificações')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar notificações do utilizador autenticado' })
  findAll(
    @GetUser('id') userId: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.notificationsService.findAllForUser(
      userId,
      unreadOnly === 'true',
    );
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Contagem de notificações não lidas' })
  unreadCount(@GetUser('id') userId: string) {
    return this.notificationsService.unreadCount(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  markAsRead(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.notificationsService.markAsRead(id, userId);
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Marcar todas como lidas' })
  markAllAsRead(@GetUser('id') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }
}
