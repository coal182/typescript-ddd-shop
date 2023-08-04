import { v4 as uuidv4 } from 'uuid';

export function addIdIfNotExists(obj: Record<string, unknown>): any {
  if (!obj.id) {
    const id = uuidv4();
    return { id, ...obj };
  }
  return obj;
}

export function getRandomFloat(min: number, max: number, decimals: number) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}
