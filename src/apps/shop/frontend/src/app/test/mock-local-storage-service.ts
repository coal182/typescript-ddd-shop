import { StorageData, StorageDataKey, StorageService } from '../shared/services/storage.service';

export class MockStorageService implements StorageService {
  private _localStorage: StorageData | undefined = {
    user_id: 'user-id',
    cart: JSON.stringify({
      id: 'cart-id',
      userId: 'user-id',
    }),
  };

  setItem(key: StorageDataKey, data) {
    this._localStorage[key] = data;
  }

  getItem(key: StorageDataKey): string {
    return this._localStorage[key];
  }

  removeItem(key: StorageDataKey) {
    delete this._localStorage[key];
  }

  clear() {
    this._localStorage = {};
  }
}
