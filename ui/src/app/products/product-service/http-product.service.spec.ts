import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from 'src/environments/environment';

import { Operator } from '../products';

import { HttpProductService } from './http-product.service';
import { GetProductsParams, ProductService } from './product.service';

fdescribe('HttpProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const dummyProducts = {
    status: 200,
    message: 'Successfully retrieve the books',
    data: [
      {
        _id: '631095b312fcdc9e23a17337',
        id: '7cc271a4-14cc-434d-8c23-8d936a0e4d46',
        name: 'A Little Journey',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum faucibus semper vulputate. \n      In id ex ac urna dictum feugiat aliquam sit amet lorem. Nunc ut eleifend massa, at ultrices nunc. \n      Aenean dignissim luctus magna non egestas. Praesent feugiat turpis sed tristique elementum. \n      Quisque pharetra imperdiet erat quis facilisis. Nam dictum venenatis mi vitae aliquam. \n      Morbi ac augue at nibh convallis imperdiet ac id ipsum. Etiam auctor, arcu in iaculis convallis, \n      neque est scelerisque metus, eu tincidunt turpis ex quis ex. Proin at nisi a sem fringilla ultrices. \n      Pellentesque egestas iaculis sapien, a congue dolor pretium eget. Nunc at metus tellus. \n      Morbi sollicitudin placerat leo, ut viverra ante semper dignissim. \n      Duis posuere, elit quis elementum pretium, tellus justo aliquam massa, quis iaculis metus purus non neque. \n      Maecenas bibendum efficitur blandit. Aenean egestas malesuada elit sit amet bibendum.',
        image: 'https://www.gutenberg.org/cache/epub/51171/pg51171.cover.medium.jpg',
        author: {
          _id: '62d01d3e030d7301a5c1707a',
          id: 'd0c3ce2f-3134-4357-9742-658f64d4d8b9',
          firstname: 'Cristian',
          lastname: 'Martin Niclife',
        },
        price: 18.17,
        version: 0,
      },
      {
        _id: '631095b312fcdc9e23a17331',
        id: 'b774537d-3b1d-4431-9351-fd8b282d8570',
        name: 'All Around the Moon',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum faucibus semper vulputate. \n      In id ex ac urna dictum feugiat aliquam sit amet lorem. Nunc ut eleifend massa, at ultrices nunc. \n      Aenean dignissim luctus magna non egestas. Praesent feugiat turpis sed tristique elementum. \n      Quisque pharetra imperdiet erat quis facilisis. Nam dictum venenatis mi vitae aliquam. \n      Morbi ac augue at nibh convallis imperdiet ac id ipsum. Etiam auctor, arcu in iaculis convallis, \n      neque est scelerisque metus, eu tincidunt turpis ex quis ex. Proin at nisi a sem fringilla ultrices. \n      Pellentesque egestas iaculis sapien, a congue dolor pretium eget. Nunc at metus tellus. \n      Morbi sollicitudin placerat leo, ut viverra ante semper dignissim. \n      Duis posuere, elit quis elementum pretium, tellus justo aliquam massa, quis iaculis metus purus non neque. \n      Maecenas bibendum efficitur blandit. Aenean egestas malesuada elit sit amet bibendum.',
        image: 'https://www.gutenberg.org/cache/epub/16457/pg16457.cover.medium.jpg',
        author: {
          _id: '62d01d3e030d7301a5c1707a',
          id: 'd0c3ce2f-3134-4357-9742-658f64d4d8b9',
          firstname: 'Cristian',
          lastname: 'Martin Niclife',
        },
        price: 21.59,
        version: 0,
      },
      {
        _id: '631095b312fcdc9e23a17322',
        id: '18b795e0-77a0-4bb5-b379-017cd193ea17',
        name: 'Beam Pirate',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum faucibus semper vulputate. \n      In id ex ac urna dictum feugiat aliquam sit amet lorem. Nunc ut eleifend massa, at ultrices nunc. \n      Aenean dignissim luctus magna non egestas. Praesent feugiat turpis sed tristique elementum. \n      Quisque pharetra imperdiet erat quis facilisis. Nam dictum venenatis mi vitae aliquam. \n      Morbi ac augue at nibh convallis imperdiet ac id ipsum. Etiam auctor, arcu in iaculis convallis, \n      neque est scelerisque metus, eu tincidunt turpis ex quis ex. Proin at nisi a sem fringilla ultrices. \n      Pellentesque egestas iaculis sapien, a congue dolor pretium eget. Nunc at metus tellus. \n      Morbi sollicitudin placerat leo, ut viverra ante semper dignissim. \n      Duis posuere, elit quis elementum pretium, tellus justo aliquam massa, quis iaculis metus purus non neque. \n      Maecenas bibendum efficitur blandit. Aenean egestas malesuada elit sit amet bibendum.',
        image: 'https://www.gutenberg.org/cache/epub/67998/pg67998.cover.medium.jpg',
        author: {
          _id: '62d01d3e030d7301a5c1707a',
          id: 'd0c3ce2f-3134-4357-9742-658f64d4d8b9',
          firstname: 'Cristian',
          lastname: 'Martin Niclife',
        },
        price: 15.32,
        version: 0,
      },
    ],
  };

  const dummyParamsObj: GetProductsParams = {
    'filters[0][field]': 'name',
    'filters[0][operator]': Operator.CONTAINS,
    'filters[0][value]': '',
    orderBy: 'name',
    order: 'asc',
    limit: '30',
    offset: '0',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [HttpProductService] });
    service = TestBed.inject(HttpProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked for product list', () => {
    it('should fetch the product list filtered by params', () => {
      service.getProducts(dummyParamsObj).subscribe((products) => {
        expect(products.data.length).toBe(3);
        expect(products).toEqual(dummyProducts);
      });
      const req = httpMock.expectOne((request) => request.url === `${environment.apiUrl}api/v1/books`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('orderBy')).toBe('name');
      expect(req.request.params.get('limit')).toBe('30');
      expect(req.request.params).toEqual(new HttpParams({ fromObject: { ...dummyParamsObj } }));
      req.flush(dummyProducts);
    });
  });
});
