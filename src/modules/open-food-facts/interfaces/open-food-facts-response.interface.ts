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
