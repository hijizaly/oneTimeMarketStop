import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { TokenGenerator } from '../common/helper/token-generator.helper';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, TokenGenerator, JwtService],
})
export class UserModule {}
