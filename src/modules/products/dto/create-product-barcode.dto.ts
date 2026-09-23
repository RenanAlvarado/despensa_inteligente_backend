import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsValidBarcode } from '../../../common/decorators/barcode.decorator';

export class CreateProductByBarcodeDto {
  @ApiProperty({
    example: '7891000100103',
    description: 'Código de barras EAN-13 do produto.',
    minLength: 13,
    maxLength: 13,
  })
  @IsValidBarcode()
  @IsNotEmpty({
    message: 'O código de barras é obrigatório.',
  })
  barcode!: string;
}
