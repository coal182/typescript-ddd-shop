import { IdProvider } from '@domain/id-provider';

export function addIdIfNotExists(obj: Record<string, unknown>): any {
  if (!obj.id) {
    const id = IdProvider.getId();
    return { id, ...obj };
  }
  return obj;
}

export function getRandomFloat(min: number, max: number, decimals: number) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}
