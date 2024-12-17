import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { EditProductDto } from "./dto/edit-product.dto";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProducts(
    page: number,
    limit: number,
    search?: string,
    stockStatus?: string
  ) {
    const skip = page * limit;
    const take = limit;

    const filters: any = {};

    if (search) {
      filters.OR = [
        { name: { contains: search.toLowerCase() } },
        { sku: { contains: search.toLowerCase() } },
        { category: { contains: search.toLowerCase() } },
      ];
    }

    if (stockStatus) {
      switch (stockStatus) {
        case "in_stock":
          filters.stock = { gt: 10 }; // Products with stock > 10
          break;
        case "low_stock":
          filters.stock = { lte: 10, gt: 0 }; // Products with stock <= 10 and > 0
          break;
        case "out_of_stock":
          filters.stock = { lte: 0 }; // Products with stock <= 0
          break;
        default:
          break;
      }
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: filters,
        skip,
        take,
      }),
      this.prisma.product.count({
        where: filters,
      }),
    ]);

    return {
      data: products,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: +id },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async createProduct(product: CreateProductDto) {
    const productExists = await this.prisma.product.findUnique({
      where: { sku: product.sku },
    });

    if (productExists) {
      throw new ConflictException("Product already exists");
    }

    return this.prisma.product.create({ data: product });
  }

  async editProduct(id: number, product: EditProductDto) {
    return this.prisma.product.update({
      where: { id: +id },
      data: product,
    });
  }

  async deleteProduct(id: number) {
    return this.prisma.product.delete({
      where: { id: +id },
    });
  }
}
