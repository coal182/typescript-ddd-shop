import {FormGroup} from '@angular/forms';

export class MockFormBuilder {
    group(controlsConfig: {[key: string]: any}): FormGroup {
        return new FormGroup(controlsConfig);
    }
}
