import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  create(createProductDto: CreateProductDto) {

    return this.product.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalProducts = await this.product.count({
      where: { available: true }
    });
    const lastPage = Math.ceil(totalProducts / limit);
    const products = await this.product.findMany({
      where: { available: true },
      skip: (page - 1) * limit,
      take: limit
    });

    const response = {
      products,
      meta: {
        totalProducts,
        page,
        lastPage
      }
    };
    return response;
  }

  async findOneById(id: number) {
    const product = await this.product.findUnique({
      where: { id, available: true }
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id, ...dataToUpdate } = updateProductDto;
    this.findOneById(updateProductDto.id);
    return this.product.update({
      where: {
        id
      },
      data: dataToUpdate,
    });
  }

  async remove(id: number) {
    await this.findOneById(id);
    const product = await this.product.update({
      where: { id },
      data: {
        available: false
      }
    })
    return product;
  }
}
