import { FormGroup } from '@angular/forms';

export class MockFormBuilder {
  group(controlsConfig: { [key: string]: any }, options?: { [key: string]: any }): FormGroup {
    // Implementa la lógica para crear un FormGroup según tus necesidades
    return new FormGroup(controlsConfig);
  }
}
