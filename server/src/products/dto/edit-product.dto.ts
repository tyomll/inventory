import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  IsNumber,
} from "class-validator";

export class EditProductDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  description: string;

  @IsInt()
  @IsPositive()
  price: number;

  @IsInt()
  @IsPositive()
  stock: number;
}
