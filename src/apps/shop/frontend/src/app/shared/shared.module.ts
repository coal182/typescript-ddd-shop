import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MaterialModule} from './material/material.module';
import {ImagePipe} from './pipes/image.pipe';
import {LocalStorageService} from './services/local-storage/local-storage.service';
import {StorageService} from './services/storage.service';

@NgModule({
    declarations: [ImagePipe],
    imports: [CommonModule, BrowserModule, MaterialModule, BrowserAnimationsModule],
    exports: [FormsModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule, ImagePipe],
    providers: [{provide: StorageService, useClass: LocalStorageService}],
})
export class SharedModule {}
