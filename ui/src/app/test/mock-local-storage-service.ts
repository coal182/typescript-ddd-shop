import { StorageService } from "../shared/services/storage.service";

export class MockLocalStorageService implements StorageService {
    private _localStorage: Record<string, string> = {};

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