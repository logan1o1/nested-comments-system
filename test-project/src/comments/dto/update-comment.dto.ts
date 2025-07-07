import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import type { UUID } from 'crypto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  text?: string;
}
