import { IsNotEmpty } from 'class-validator';
import { IsValidBarcode } from '../../../common/decorators/barcode.decorator';

export class CreateProductByBarcodeDto {
  @IsValidBarcode()
  @IsNotEmpty({
    message: 'O código de barras é obrigatório.',
  })
  barcode!: string;
}
