import { Injectable } from '@angular/core';

import { StorageDataKey, StorageService } from '../storage.service';

import { LocalStorageRefService } from './local-storage-ref.service';

@Injectable({ providedIn: 'root' })
export class LocalStorageService implements StorageService {
  private _localStorage: Storage;

  constructor(private _localStorageRefService: LocalStorageRefService) {
    this._localStorage = this._localStorageRefService.localStorage;
  }

  setItem(key: StorageDataKey, data) {
    this._localStorage.setItem(key, data);
  }

  getItem(key: StorageDataKey) {
    return this._localStorage.getItem(key);
  }

  removeItem(key: StorageDataKey) {
    this._localStorage.removeItem(key);
  }

  clear() {
    this._localStorage.clear();
  }
}
