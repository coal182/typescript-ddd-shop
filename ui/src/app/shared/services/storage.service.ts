export interface StorageService {
    setItem(key: string, data: string): void;

    getItem(key: string): string;

    removeItem(key: string): void;

    clear(): void;
}