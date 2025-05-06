import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from './material/material.module';
import {LocalStorageService} from './services/local-storage/local-storage.service';
import {StorageService} from './services/storage.service';

@NgModule({
    imports: [CommonModule, MaterialModule],
    exports: [FormsModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
    providers: [{provide: StorageService, useClass: LocalStorageService}],
})
export class SharedModule {}
