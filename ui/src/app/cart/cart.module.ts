import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { CartComponent } from './cart.component';
import { ShippingComponent } from '../shipping/shipping.component';

@NgModule({
  declarations: [CartComponent, ShippingComponent],
  imports: [CommonModule, AppRoutingModule, BrowserModule, ReactiveFormsModule],
  exports: [CartComponent, ShippingComponent],
})
export class CartModule {}
