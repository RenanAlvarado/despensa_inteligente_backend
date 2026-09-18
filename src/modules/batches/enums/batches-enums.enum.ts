export enum BatchSortBy {
  PURCHASE_DATE = 'purchaseDate',
  EXPIRATION_DATE = 'expirationDate',
  QUANTITY = 'quantity',
  UNIT_PRICE = 'unitPrice',
}

export enum BatchStatus {
  VALID = 'VALIDO',
  EXPIRES_TODAY = 'VENCE_HOJE',
  EXPIRED = 'VENCIDO',
}
