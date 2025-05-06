import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SharedModule} from './shared/shared.module';
import {TopBarComponent} from './top-bar/top-bar.component';

@Component({
    imports: [SharedModule, RouterModule, TopBarComponent],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {}
