import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  productName: string;
  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  quantity: number;
}
