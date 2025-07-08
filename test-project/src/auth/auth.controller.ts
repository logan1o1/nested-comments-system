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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import type { Response } from 'express';
import type { UUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  async create(@Body() createAuthDto: CreateAuthDto, @Res() res: Response) {
    const user = await this.authService.create(createAuthDto);
    const token = this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_SECRET || 'secret moa' },
    );

    return res
      .cookie('AuthToken', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      })
      .status(HttpStatus.CREATED)
      .send(user);
  }

  @Post('login')
  async findOneByUsername(
    @Body() authDto: CreateAuthDto,
    @Res() res: Response,
  ) {
    const { username, password } = authDto;

    const user = await this.authService.findOneByUsername(username, password);
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send("User doesn't exist");
    }

    res.clearCookie('AuthToken');

    const token = this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_SECRET || 'secret moa', expiresIn: '5h' },
    );

    return res
      .cookie('AuthToken', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      })
      .status(HttpStatus.OK)
      .send(user);
  }

  @Get('find/:id')
  async findOneBy(@Param('id') id: UUID, @Res() res: Response) {
    const user = await this.authService.findOneBy(id);
    if (!user)
      return res.status(HttpStatus.NOT_FOUND).send({ error: 'User not found' });
    return res.status(HttpStatus.OK).send(user);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
