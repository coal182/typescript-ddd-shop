import { Injectable } from "@angular/core"
import { StorageService } from "../storage.service";
import { LocalStorageRefService } from "./local-storage-ref.service";

@Injectable({ providedIn: "root" })
export class LocalStorageService implements StorageService {
    private _localStorage: Storage;

    constructor(private _localStorageRefService: LocalStorageRefService) {
        this._localStorage = this._localStorageRefService.localStorage;
    }

    setItem(key, data) {
        this._localStorage.setItem(key, data);
    }

    getItem(key) {
        return this._localStorage.getItem(key);
    }

    removeItem(key) {
        this._localStorage.removeItem(key);
    }

    clear() {
        this._localStorage.clear();
    }
}