import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsMongoId, IsNumber, Min, ValidateNested } from 'class-validator';

export class CheckoutItemDto {
  @ApiProperty({ example: '665f1f77c7f0b2b4b6741b91' })
  @IsMongoId()
  vehicleId!: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class CheckoutDto {
  @ApiProperty({ type: [CheckoutItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items!: CheckoutItemDto[];
}
