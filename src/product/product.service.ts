import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly dbService: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    const newProduct = await this.dbService.product.create({
      data: {
        name: createProductDto.productName,
        price: createProductDto.price,
        quantity: createProductDto.quantity,
        availablty: true,
      },
    });
    if (!newProduct) {
      throw new HttpException(
        `Something went wrong , failed to add product`,
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      message: 'Product Added successfully',
      data: newProduct,
    };
  }

  async findAll() {
    const products = await this.dbService.product.findMany();
    return {
      message: 'Products retrieved successfully',
      data: products,
    };
  }

  async findOne(id: number) {
    const product = await this.dbService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return {
      message: 'Product retrieved successfully',
      data: product,
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.dbService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const updatedProduct = await this.dbService.product.update({
      where: { id },
      data: {
        name: updateProductDto.productName,
        price: updateProductDto.price,
        quantity: updateProductDto.quantity,
      },
    });

    return {
      message: 'Product updated successfully',
      data: updatedProduct,
    };
  }

  async remove(id: number) {
    const product = await this.dbService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    await this.dbService.product.delete({ where: { id } });

    return {
      message: 'Product deleted successfully',
    };
  }
}
