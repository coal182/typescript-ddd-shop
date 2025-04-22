import { provideHttpClientTesting } from '@angular/common/http/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatAutocomplete} from '@angular/material/autocomplete';

import {FinderComponent} from './finder.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('FinderComponent', () => {
    let component: FinderComponent;
    let fixture: ComponentFixture<FinderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    declarations: [FinderComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [MatAutocomplete],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FinderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
