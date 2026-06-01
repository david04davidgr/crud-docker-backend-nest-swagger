import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  brand!: string;

  @ApiProperty({ example: 'Corolla' })
  @IsString()
  model!: string;

  @ApiProperty({ example: 2022 })
  @IsNumber()
  @Min(1900)
  @Max(2100)
  year!: number;

  @ApiProperty({ example: 18990 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(0)
  stock!: number;

  @ApiProperty({ example: 'Compacto hibrido con garantia oficial.', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/corolla.jpg', required: false })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
