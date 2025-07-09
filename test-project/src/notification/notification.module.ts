import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    AuthModule
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [
    NotificationService,
    TypeOrmModule
  ]
})
export class NotificationModule {}
