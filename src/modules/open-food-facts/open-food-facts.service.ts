import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OpenFoodFactsResponse } from './interfaces/open-food-facts-response.interface';
import { ExternalProductData } from './interfaces/external-product-data.interface';

@Injectable()
export class OpenFoodFactsService {
  private readonly baseUrl = 'https://world.openfoodfacts.org';

  constructor(private readonly httpService: HttpService) {}

  // Buscar Dados do Produto
  async findProductByBarcode(
    barcode: string,
  ): Promise<ExternalProductData | null> {
    // Verificar Formato
    this.validateBarcode(barcode);

    // Formar URL
    const url = `${this.baseUrl}/api/v3/product/${barcode}`;

    const response = await firstValueFrom(
      this.httpService.get<OpenFoodFactsResponse>(url, {
        headers: {
          'User-Agent': 'DespensaInteligente/1.0',
        },
        validateStatus: (status) => status < 500,
      }),
    );

    if (response.data.result?.id === 'product_not_found') {
      throw new NotFoundException(
        'Nenhum produto foi encontrado para este código de barras na API Externa.',
      );
    }

    const { product } = response.data;

    if (!product) {
      return null;
    }

    return {
      barcode: response.data.code,
      name: product.product_name ?? null,
      brand: product.brands ?? null,
      category: product.categories ?? null,
      quantity: product.product_quantity ?? null,
      unit: product.product_quantity_unit ?? null,
      imageUrl: product.selected_images?.front?.display?.pt ?? null,
    };
  }

  // Verificação de Código de BArras
  private validateBarcode(barcode: string): void {
    if (!/^\d{13}$/.test(barcode)) {
      throw new BadRequestException(
        'O código de barras deve conter exatamente 13 dígitos.',
      );
    }
  }
}
