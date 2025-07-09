import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import type { Request, Response } from 'express';
import type { UUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('create')
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Res() res: Response,
  ) {
    const comment = await this.commentsService.create(createCommentDto);

    return res.status(HttpStatus.CREATED).send(comment);
  }

  @Get('get')
  async findTrees(@Res() res: Response) {
    const comments = await this.commentsService.findTrees();

    return res.status(HttpStatus.OK).send(comments);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: UUID,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = req.cookies?.AuthToken;
    if (!token)
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ error: 'Not Authenticated' });

    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'secret moa',
      });
    } catch (err) {
      return res.status(401).send({ error: 'Invalid token' });
    }

    const userId: UUID = payload.sub;

    const updated = await this.commentsService.update(
      id,
      updateCommentDto,
      userId,
    );

    if (!updated.success)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: updated.message });

    res.status(HttpStatus.OK).send(updated);
  }

  @Delete('delete/:id')
  async remove(
    @Param('id') id: UUID,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = req.cookies?.AuthToken;
    if (!token)
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ error: 'Not Authenticated' });

    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'secret moa',
      });
    } catch (err) {
      return res.status(401).send({ error: 'Invalid token' });
    }

    const userId: UUID = payload.sub;

    const removed = await this.commentsService.remove(id, userId);
    if (!removed.success)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: removed.message });

    return res.status(HttpStatus.OK).send(removed)
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.commentsService.findOne(+id);
  // }
}
