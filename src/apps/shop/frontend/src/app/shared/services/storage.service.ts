export abstract class StorageService {
    abstract setItem(key: StorageDataKey, data: string): void;

    abstract getItem(key: StorageDataKey): string;

    abstract removeItem(key: StorageDataKey): void;

    abstract clear(): void;
}

export interface StorageData {
    access_token?: string;
    user_id?: string;
    cart?: string;
}

export type StorageDataKey = keyof StorageData;
