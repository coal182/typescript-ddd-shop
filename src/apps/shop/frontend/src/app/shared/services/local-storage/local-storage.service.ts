import {Injectable} from '@angular/core';

import {LocalStorageRefService} from './local-storage-ref.service';

import {StorageDataKey, StorageService} from '../storage.service';

@Injectable({providedIn: 'root'})
export class LocalStorageService implements StorageService {
    private _localStorage: Storage;

    constructor(private _localStorageRefService: LocalStorageRefService) {
        this._localStorage = this._localStorageRefService.localStorage;
    }

    public setItem(key: StorageDataKey, data): void {
        this._localStorage.setItem(key, data);
    }

    public getItem(key: StorageDataKey): string {
        return this._localStorage.getItem(key);
    }

    public removeItem(key: StorageDataKey): void {
        this._localStorage.removeItem(key);
    }

    public clear(): void {
        this._localStorage.clear();
    }
}
