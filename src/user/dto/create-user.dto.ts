import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;
  @IsNotEmpty()
  mobile: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class UserCredentialDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
