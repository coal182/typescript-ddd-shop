import {NgModule} from '@angular/core';

import {LocalStorageService} from './services/local-storage/local-storage.service';
import {StorageService} from './services/storage.service';

@NgModule({
    providers: [{provide: StorageService, useClass: LocalStorageService}],
})
export class SharedModule {}
