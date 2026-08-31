import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import {
  CompleteExternalProductData,
  OpenFoodFactsResponse,
  OpenFoodFactsSearchProduct,
  OpenFoodFactsSearchResponse,
} from './interfaces/open-food-facts.interfaces';
import { ExternalProductData } from './interfaces/open-food-facts.interfaces';
import { UnitType } from '../../common/enums/unit-type.enum';

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

    return this.validateCompleteProduct(externalProduct);
  }

  // Buscar produtos por nome
  async searchProductsByName(name: string): Promise<ExternalProductData[]> {
    this.validateSearchName(name);

    const params = new URLSearchParams({
      search_terms: name,
      page_size: '30',
      json: 'true',
    });

    const url = `${this.baseUrl}/cgi/search.pl?${params.toString()}`;

    const response = await this.get<OpenFoodFactsSearchResponse>(url);

    const products = [...response.data.products];

    products.sort((a, b) => {
      return this.getBrazilRelevance(b) - this.getBrazilRelevance(a);
    });

    return products.map((product) => this.mapSearchProduct(product));
  }

  private validateCompleteProduct(
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

    if (!product.brand) {
      throw new BadRequestException(
        'A API externa não retornou a marca do produto.',
      );
    }

    if (!product.category) {
      throw new BadRequestException(
        'A API externa não retornou a categoria do produto.',
      );
    }

    if (product.quantity === null) {
      throw new BadRequestException(
        'A API externa não retornou a quantidade do produto.',
      );
    }

    if (!product.unit) {
      throw new BadRequestException(
        'A API externa não retornou a unidade do produto.',
      );
    }

    return {
      barcode: product.barcode,
      name: product.name,
      brand: product.brand,
      category: product.category,
      imageUrl: product.imageUrl,
      quantity: product.quantity,
      unit: this.mapUnitType(product.unit),
    };
  }

  // Verificação de Código de Barras
  private validateBarcode(barcode: string): void {
    if (!/^\d{13}$/.test(barcode)) {
      throw new BadRequestException(
        'O código de barras deve conter exatamente 13 dígitos.',
      );
    }
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
      unit: product.product_quantity_unit ?? null,
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

  // Método auxiliar para descobrir os produtos BR
  private getBrazilRelevance(product: OpenFoodFactsSearchProduct): number {
    const popularityTags = product.popularity_tags ?? [];
    const countriesTags = product.countries_tags ?? [];

    const currentYear = new Date().getFullYear();

    const countryTag = popularityTags.find(
      (tag) => tag === `top-country-br-scans-${currentYear}`,
    );

    if (countryTag) {
      return 100000;
    }

    const brazilTag = popularityTags.find((tag) =>
      new RegExp(`^top-(\\d+)-br-scans-${currentYear}$`).test(tag),
    );

    if (brazilTag) {
      const match = brazilTag.match(
        new RegExp(`^top-(\\d+)-br-scans-${currentYear}$`),
      );

      if (match) {
        const position = Number(match[1]);

        return 100000 / position;
      }
    }

    if (countriesTags.includes('en:brazil')) {
      return 1;
    }

    return 0;
  }

  // Pegar primeiro valor da lista
  private getFirstValue(value?: string | null): string | null {
    if (!value) {
      return null;
    }

    return (
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)[0] ?? null
    );
  }

  private mapUnitType(unit: string): UnitType {
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
        throw new BadRequestException(
          `Unidade de medida não suportada: ${unit}`,
        );
    }
  }
}
