export enum BatchMovementType {
  ENTRY = 'ENTRADA',
  CONSUMPTION = 'CONSUMO',
  DISPOSAL = 'DESCARTE',
  ADJUSTMENT = 'AJUSTE',
}

export const BatchMovementConfig: Record<
  BatchMovementType,
  { increase: boolean | null }
> = {
  [BatchMovementType.ENTRY]: {
    increase: true,
  },

  [BatchMovementType.CONSUMPTION]: {
    increase: false,
  },

  [BatchMovementType.DISPOSAL]: {
    increase: false,
  },

  [BatchMovementType.ADJUSTMENT]: {
    increase: null,
  },
};
