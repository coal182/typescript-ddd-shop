import {Component} from '@angular/core';
import {injectBrnDialogContext} from '@spartan-ng/brain/dialog';
import {HlmDialogImports} from '@spartan-ng/helm/dialog';

export interface DialogData {
    title: string;
    msg: string;
}

@Component({
    selector: 'alert-dialog',
    templateUrl: './alert-dialog.component.html',
    imports: [...HlmDialogImports],
})
export class AlertDialogComponent {
    public readonly data = injectBrnDialogContext<DialogData>();
}
