import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import type { Repository, TreeRepository } from 'typeorm';
import type { UUID } from 'crypto';
import { CreateNotificationDto } from '../notification/dto/create-notification.dto';
import { Notification } from '../notification/entities/notification.entity';

type UpdateResult =
  | { success: true; comment: Comment }
  | { success: false; message: string };

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: TreeRepository<Comment>,

    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>
  ) {}
  async create(createCommentDto: CreateCommentDto) {
    const comment = this.commentRepository.create({
      userid: createCommentDto.userid,
      text: createCommentDto.text
    });

    let parentUserId: UUID | null = null;

    if (createCommentDto.parentId) {
      const parent = await this.commentRepository.findOne({where: {id: createCommentDto.parentId} })
      if (!parent) throw new Error('No parent comments exist');
      comment.parent = parent;
      parentUserId = parent.userid;
    }

    const savedComment = await this.commentRepository.save(comment);

    if (createCommentDto.parentId) {
      const notifDto: CreateNotificationDto = {
        userId: parentUserId!,
        commentId: savedComment.id,
      }

      const notification = this.notifRepo.create({
        user: {id: notifDto.userId},
        comment: {id: notifDto.commentId},
      });
      await this.notifRepo.save(notification);
    }

    return savedComment;
  }

  async findTrees() {
    const trees = await this.commentRepository.findTrees();

    return trees;
  }

  async update(id: UUID, updateCommentDto: UpdateCommentDto, userId: UUID) {
    const comment = await this.commentRepository.findOne({where: {id}});

    if (!comment) return {success: false, message: "Comment doesn't exist"};

    if (comment.userid != userId) return {success: false, message: "Unauthorized asscess not permited"};

    const now = new Date();
    const createdAt = comment.createdAt;
    const timeDiff = (now.getTime() - createdAt.getTime())/ 60000;

    if (timeDiff > 15) return { success: false, message: 'Edit window (15 min) has expired' };

    if (updateCommentDto.text) comment.text = updateCommentDto.text;

    const updated = await this.commentRepository.save(comment);
    return { success: true, comment: updated };
  }

  async remove(id: UUID, userId: UUID) {
    const comment = await this.commentRepository.findOne({where: {id}});

    if (!comment) return {success: false, message: "Comment doesn't exist"};

    if (comment.userid != userId) return {success: false, message: "Unauthorized asscess not permited"};

    const now = new Date();
    const createdAt = comment.createdAt;
    const timeDiff = (now.getTime() - createdAt.getTime())/ 60000;

    if (timeDiff > 15) return { success: false, message: 'Edit window (15 min) has expired' };

    comment.text = "";
    comment.userid = null;

    const removed = await this.commentRepository.save(comment);
    return {success: true, comment: removed};
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }
}
