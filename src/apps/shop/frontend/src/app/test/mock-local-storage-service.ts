import { StorageService } from '../shared/services/storage.service';

export class MockStorageService implements StorageService {
  private _localStorage: Record<string, string> = {
    user_id: 'user-id',
    cart: JSON.stringify({
      id: 'cart-id',
      userId: 'user-id',
    }),
  };

  setItem(key, data) {
    this._localStorage[key] = data;
  }

  getItem(key: string): string {
    return this._localStorage[key];
  }

  removeItem(key) {
    delete this._localStorage[key];
  }

  clear() {
    this._localStorage = {};
  }
}
