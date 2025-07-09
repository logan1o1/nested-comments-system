import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import type { Repository } from 'typeorm';
import type { UUID } from 'crypto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
  ) {}

  async findAllForUser(userId: UUID) {
    return await this.notifRepo
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.comment', 'comment')
      .leftJoinAndSelect('notification.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .getMany();
  }

  async updateReadState(id: string, read: boolean): Promise<Notification> {
    const notif = await this.notifRepo.findOne({ where: { id } });
    if (!notif) throw new Error('Notification not found');

    await this.notifRepo
      .createQueryBuilder()
      .update(Notification)
      .set({ read })
      .where('id = :id', { id })
      .execute();

    const updated = await this.notifRepo.findOne({
      where: { id },
      relations: ['user', 'comment'],
    });
    if (!updated) throw new Error("Notification Update failed");

    return updated;
  }

  async markAllReadForUser(userId: UUID): Promise<void> {
    await this.notifRepo
      .createQueryBuilder()
      .update(Notification)
      .set({ read: true })
      .where('userId = :userId', { userId })
      .execute();
  }

  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
