import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UserCredentialDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { compare, hash } from 'bcrypt';
import { TokenGenerator } from '../common/helper/token-generator.helper';

@Injectable()
export class UserService {
  constructor(
    private readonly dbService: PrismaService,
    private readonly tokenGenerator: TokenGenerator,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const isUserAlreadyExisted = await this.dbService.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });

    if (isUserAlreadyExisted) {
      throw new HttpException(
        `Email is already used`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const newUser = await this.dbService.user.create({
      data: {
        name: createUserDto.fullname,
        email: createUserDto.email,
        password: await hash(createUserDto.password, 12),
        mobile: createUserDto.mobile,
      },
    });

    if (newUser) {
      return {
        message: 'Account created successfully',
        data: newUser,
      };
    } else {
      throw new HttpException(`Some thing went wrong`, HttpStatus.NOT_FOUND);
    }
  }

  async userSignIn(userCretialDto: UserCredentialDto) {
    const isUserAlreadyExisted = await this.dbService.user.findFirst({
      where: {
        email: userCretialDto.email,
      },
    });
    if (!isUserAlreadyExisted) {
      throw new HttpException(
        `Incorrect email or password`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (!isUserAlreadyExisted.status) {
      throw new HttpException(
        `Pleas activate your account, check your email for activation code`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (
      !(await compare(userCretialDto.password, isUserAlreadyExisted.password))
    ) {
      throw new HttpException(
        `Incorrect email or password`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    delete isUserAlreadyExisted.password;
    delete isUserAlreadyExisted.createdAt;
    delete isUserAlreadyExisted.updatedAt;

    const token = await this.tokenGenerator.generateJWT_(isUserAlreadyExisted);

    //GENERATE ACCESS TOKEN AND REFRESH TOKEN
    return { token: token, ...isUserAlreadyExisted };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
