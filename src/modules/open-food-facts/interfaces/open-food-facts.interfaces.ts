import { UnitType } from '../../../common/enums/unit-type.enum';

export interface OpenFoodFactsResponse {
  code: string;
  status: string;
  result?: {
    id: string;
    lc_name: string;
    name: string;
  };
  product?: {
    product_name?: string;
    brands?: string;
    categories?: string;
    product_quantity?: number;
    product_quantity_unit?: string;

    selected_images?: {
      front?: {
        display?: {
          pt?: string;
        };
      };
    };
  };
}

export interface ExternalProductData {
  barcode: string | null;
  name: string | null;
  brand: string | null;
  category: string | null;
  imageUrl: string | null;
  quantity: number | null;
  unit: string | null;
}

export interface CompleteExternalProductData {
  barcode: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  quantity: number;
  unit: UnitType;
}

export interface OpenFoodFactsSearchResponse {
  products: OpenFoodFactsSearchProduct[];
  count: number;
  page: number;
  page_count: number;
  page_size: number;
}

export interface OpenFoodFactsSearchProduct {
  code?: string;
  product_name?: string;
  brands?: string;
  categories?: string;
  product_quantity?: number;
  product_quantity_unit?: string;

  selected_images?: {
    front?: {
      display?: {
        pt?: string;
      };
    };
  };

  popularity_key?: number;
  popularity_tags?: string[];
  countries_tags?: string[];
}
