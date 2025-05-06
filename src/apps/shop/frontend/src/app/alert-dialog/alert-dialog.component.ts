import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
    title: string;
    msg: string;
}

/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
    selector: 'alert-dialog',
    templateUrl: './alert-dialog.component.html',
})
export class AlertDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
