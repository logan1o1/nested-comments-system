import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import {
  Repository,
  type FindOneOptions,
  type FindOptionsWhere,
} from 'typeorm';
import type { UUID } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    const hashedPasswd = await bcrypt.hash(createAuthDto.password, 12);

    const auth = this.authRepository.create({
      username: createAuthDto.username,
      email: createAuthDto.email,
      password: hashedPasswd,
    });
    return await this.authRepository.save(auth);
  }

  async findOneByUsername(username: string, password: string) {
    const user = await this.authRepository.findOneBy( { username } as FindOptionsWhere<Auth>);

    if (!user) {
      throw new Error("User doesn't exsist") ;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Wrong password, please type again"); 
    }

    return user;
  }

  async findOne(id: `${string}-${string}-${string}-${string}-${string}`) {
    return await this.authRepository
    .createQueryBuilder('auth')
    .where('auth.id = :id', { id: id })
    .select(['auth.id', 'auth.username'])  
    .getOne();
  }

  findAll() {
    return `This action returns all auth`;
  }


  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
