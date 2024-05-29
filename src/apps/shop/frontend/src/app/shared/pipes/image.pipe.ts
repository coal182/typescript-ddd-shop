import {Pipe, PipeTransform} from '@angular/core';

import {Product} from '../../products/interfaces/products.interface';

@Pipe({
    name: 'image',
    pure: false, //disparar cada vez que se detecta un cambio en el ciclo de angular (too expensive)
})
export class ImagePipe implements PipeTransform {
    transform(product: Product): string {
        if (!product.images.length) {
            return '/assets/images/no-image.png';
        } else if (product.images[0]) {
            return '/assets/images/products/' + product.images[0];
        }
    }
}
