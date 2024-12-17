import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";

@Controller("products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get("")
  async getProducts(
    @Query("page") page: string = "0",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string,
    @Query("stockStatus") stockStatus?: string
  ) {
    const pageNumber = parseInt(page, 10) || 0;
    const pageSize = parseInt(limit, 10) || 10;

    return this.productsService.getProducts(
      pageNumber,
      pageSize,
      search,
      stockStatus
    );
  }

  @Post("")
  async createProduct(@Body() product: CreateProductDto) {
    return this.productsService.createProduct(product);
  }
}
