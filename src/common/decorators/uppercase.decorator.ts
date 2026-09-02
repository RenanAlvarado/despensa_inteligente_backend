import { Transform } from 'class-transformer';

export function ToUpperCase() {
  return Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') {
      return value;
    }

    return value.toUpperCase();
  });
}
