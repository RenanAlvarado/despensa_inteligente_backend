import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { UnitType } from '../../common/enums/unit-type.enum';
import {
  CompleteExternalProductData,
  ExternalProductData,
  OpenFoodFactsResponse,
  OpenFoodFactsSearchProduct,
  OpenFoodFactsSearchResponse,
} from './interfaces/open-food-facts.interfaces';

@Injectable()
export class OpenFoodFactsService {
  private readonly baseUrl = 'https://world.openfoodfacts.net';

  constructor(private readonly httpService: HttpService) {}

  // Método genérico de busca
  private async get<T>(url: string) {
    return firstValueFrom(
      this.httpService
        .get<T>(url, {
          headers: {
            'User-Agent': 'DespensaInteligente/1.0',
          },
          validateStatus: (status) => status < 500,
        })
        .pipe(
          catchError(() =>
            throwError(
              () =>
                new ServiceUnavailableException(
                  'O serviço de consulta de produtos está indisponível no momento.',
                ),
            ),
          ),
        ),
    );
  }

  // Buscar Dados do Produto
  async findProductByBarcode(
    barcode: string,
  ): Promise<CompleteExternalProductData> {
    this.validateBarcode(barcode);

    const url = `${this.baseUrl}/api/v3/product/${barcode}`;

    const response = await this.get<OpenFoodFactsResponse>(url);

    if (response.data.result?.id === 'product_not_found') {
      throw new NotFoundException(
        'Nenhum produto foi encontrado para este código de barras na API Externa.',
      );
    }

    const { product } = response.data;

    if (!product) {
      throw new NotFoundException(
        'Nenhum produto foi encontrado para este código de barras na API Externa.',
      );
    }

    const externalProduct: ExternalProductData = {
      barcode: response.data.code,
      name: product.product_name ?? null,
      brand: this.getFirstValue(product.brands),
      category: this.getFirstValue(product.categories),
      quantity: product.product_quantity ?? null,
      unit: product.product_quantity_unit ?? null,
      imageUrl: product.selected_images?.front?.display?.pt ?? null,
    };

    return this.validateExternalProduct(externalProduct);
  }

  // Busca de Produtos opcional (Salvamento Manual)
  async tryFindProductByBarcode(
    barcode: string,
  ): Promise<CompleteExternalProductData | null> {
    try {
      return await this.findProductByBarcode(barcode);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }

      throw error;
    }
  }

  // Verificação de Código de Barras
  private validateBarcode(barcode: string): void {
    if (!/^\d{13}$/.test(barcode)) {
      throw new BadRequestException(
        'O código de barras deve conter exatamente 13 dígitos.',
      );
    }
  }

  // verificar os dados de retorno
  private validateExternalProduct(
    product: ExternalProductData,
  ): CompleteExternalProductData {
    if (!product.barcode) {
      throw new BadRequestException(
        'A API externa não retornou um código de barras válido.',
      );
    }

    if (!product.name) {
      throw new BadRequestException(
        'A API externa não retornou o nome do produto.',
      );
    }

    return {
      barcode: product.barcode,
      name: product.name,
      brand: product.brand,
      category: product.category,
      imageUrl: product.imageUrl,
      quantity: product.quantity,
      unit: product.unit ? this.tryMapUnitType(product.unit) : null,
    };
  }

  private getFirstValue(value?: string | null): string | null {
    return value?.split(',')[0]?.trim() || null;
  }

  // Mapeamento das unidades baseado no que pode ser aceito no banco
  private tryMapUnitType(unit: string): UnitType | null {
    const normalizedUnit = unit.toLowerCase().trim();

    switch (normalizedUnit) {
      case 'g':
        return UnitType.G;

      case 'kg':
        return UnitType.KG;

      case 'ml':
        return UnitType.ML;

      case 'l':
        return UnitType.L;

      case 'unit':
      case 'units':
      case 'un':
        return UnitType.UN;

      default:
        return null;
    }
  }

  // Buscar Produtos pelo nome
  async searchProductsByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponseDto<ExternalProductData>> {
    this.validateSearchName(name);

    const params = new URLSearchParams({
      action: 'process',
      search_terms: name,
      tagtype_0: 'countries',
      tag_contains_0: 'contains',
      tag_0: 'Brazil',
      page: String(page),
      page_size: String(limit),
      json: 'true',
    });

    const url = `${this.baseUrl}/cgi/search.pl?${params.toString()}`;

    const response = await this.get<OpenFoodFactsSearchResponse>(url);

    const products = response.data.products;

    return {
      data: products.map((product) => this.mapSearchProduct(product)),
      meta: {
        page,
        limit,
        total: Number(response.data.count),
        totalPages: Math.ceil(Number(response.data.count) / limit),
      },
    };
  }

  // Mapear produto da pesquisa
  private mapSearchProduct(
    product: OpenFoodFactsSearchProduct,
  ): ExternalProductData {
    return {
      barcode: product.code ?? null,
      name: product.product_name ?? null,
      brand: this.getFirstValue(product.brands),
      category: this.getFirstValue(product.categories),
      quantity: product.product_quantity ?? null,
      unit: product.product_quantity_unit
        ? this.tryMapUnitType(product.product_quantity_unit)
        : null,
      imageUrl: product.selected_images?.front?.display?.pt ?? null,
    };
  }

  // Verificar nome da pesquisa
  private validateSearchName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new BadRequestException(
        'O nome do produto deve conter pelo menos 2 caracteres.',
      );
    }
  }
}
