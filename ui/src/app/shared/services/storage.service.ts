export abstract class StorageService {
  abstract setItem(key: string, data: string): void;

  abstract getItem(key: string): string;

  abstract removeItem(key: string): void;

  abstract clear(): void;
}
