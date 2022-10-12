import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { CartComponent } from './cart.component';
import { ShippingComponent } from '../shipping/shipping.component';
import { SharedModule } from '../shared/shared.module';
import { LocalStorageService } from '../shared/services/local-storage/local-storage.service';

@NgModule({
  declarations: [CartComponent, ShippingComponent],
  imports: [CommonModule, AppRoutingModule, BrowserModule, ReactiveFormsModule, SharedModule],
  exports: [CartComponent, ShippingComponent],
  providers: [{
    provide: 'StorageService', useClass: LocalStorageService
  }],
})
export class CartModule {}
