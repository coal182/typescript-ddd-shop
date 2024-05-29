import {StorageData, StorageDataKey, StorageService} from '../shared/services/storage.service';

export class MockStorageService implements StorageService {
    private _localStorage: StorageData | undefined = {
        user_id: 'user-id',
        cart: JSON.stringify({
            id: 'cart-id',
            userId: 'user-id',
        }),
    };

    public setItem(key: StorageDataKey, data): void {
        this._localStorage[key] = data;
    }

    getItem(key: StorageDataKey): string {
        return this._localStorage[key];
    }

    public removeItem(key: StorageDataKey): void {
        delete this._localStorage[key];
    }

    public clear(): void {
        this._localStorage = {};
    }
}
