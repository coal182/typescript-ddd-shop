import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, BrowserModule, MaterialModule, BrowserAnimationsModule],
  exports: [FormsModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
})
export class SharedModule {}
