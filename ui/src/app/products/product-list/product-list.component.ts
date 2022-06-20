import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { HttpProductService } from '../product-service/http-product.service';
import { Product } from '../../products';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  public isLoading = false;

  products$: Observable<any>;

  constructor(public productService: HttpProductService) {}

  ngOnInit() {
    const params = {};

    this.products$ = this.productService
      .getProducts(params)
      .pipe(map((pro) => pro.data));
  }

  ngAfterViewInit(): void {}

  onNotify() {
    window.alert('You will be notified when the product goes on sale');
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
