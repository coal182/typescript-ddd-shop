import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from '../app-routing.module';
import { LocalStorageService } from '../shared/services/local-storage/local-storage.service';
import { SharedModule } from '../shared/shared.module';
import { ShippingComponent } from '../shipping/shipping.component';

import { CartComponent } from './pages/cart/cart.component';

@NgModule({
  declarations: [CartComponent, ShippingComponent],
  imports: [CommonModule, AppRoutingModule, BrowserModule, ReactiveFormsModule, SharedModule],
  exports: [CartComponent, ShippingComponent],
  providers: [
    {
      provide: 'StorageService',
      useClass: LocalStorageService,
    },
  ],
})
export class CartModule {}
