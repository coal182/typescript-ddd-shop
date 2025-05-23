import {Provider} from '@angular/core';
import Swal, {SweetAlertIcon} from 'sweetalert2';

import {PopupService} from './popup-service';

export class SwalPopupService implements PopupService {
    open(title: string, html: string, type: SweetAlertIcon): void {
        Swal.fire(title, html, type);
    }
}

export function provideSwalPopupService(): Array<Provider> {
    return [{provide: PopupService, useClass: SwalPopupService}];
}
