export function capitalizeFirstLetter(value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return trimmedValue;
  }

  return (
    trimmedValue.charAt(0).toLocaleUpperCase('pt-BR') + trimmedValue.slice(1)
  );
}
