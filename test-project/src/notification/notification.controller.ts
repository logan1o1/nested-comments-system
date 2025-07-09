import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import type { UUID } from 'crypto';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('get-notif')
  async findAll(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.AuthToken;
    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).send({ error: 'Not authenticated' });
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'secret moa',
      });
    } catch (err) {
      return res.status(HttpStatus.UNAUTHORIZED).send({ error: 'Invalid token' });
    }

    const userId: UUID = payload.sub;

    const notifs = await this.notificationService.findAllForUser(userId);

    return res.status(HttpStatus.OK).send(notifs);
  }

  @Patch('read/:id')
  async markRead(
    @Param('id') id: string,
    @Body() body: UpdateNotificationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const updated = await this.notificationService.updateReadState(
        id,
        body.read,
      );
      return res.status(HttpStatus.OK).send(updated);
    } catch (err) {
      return res.status(HttpStatus.NOT_FOUND).send({ error: err.message });
    }
  }

  @Patch('read-all')
  async markAllRead(@Req() req: any, @Res() res: Response) {
    const token = req.cookies?.AuthToken;
    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).send({ error: 'Not authenticated' });
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'secret moa',
      });
    } catch {
      return res.status(HttpStatus.UNAUTHORIZED).send({ error: 'Invalid token' });
    }
    const userId = payload.sub;

    await this.notificationService.markAllReadForUser(userId);
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
