import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // @Post()
  @MessagePattern({ cmd: 'create_product' })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'find_all_products' })
  async findAll(@Payload() paginationDto: PaginationDto) {
    return await this.productsService.findAll(paginationDto);
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'find_one_product' })
  async findOne(@Payload('id', ParseIntPipe) id: number) {
    return await this.productsService.findOneById(id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update_product' })
  async update(@Payload() updateProductDto: any) {
    console.log("update cmd", updateProductDto);
    return await this.productsService.update(updateProductDto);
  }

  // @Delete(':id')
  @MessagePattern({ cmd: 'delete_product' })
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }


  @MessagePattern({ cmd: 'validate_products' })
  validateProducts(@Payload() ids: number[]) {
    return this.productsService.validateProducts(ids);
  }

}
