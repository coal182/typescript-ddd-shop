import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {injectBrnDialogContext} from '@spartan-ng/brain/dialog';

import {AlertDialogComponent} from './alert-dialog.component';

describe('AlertDialogComponent', () => {
    let component: AlertDialogComponent;
    let fixture: ComponentFixture<AlertDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AlertDialogComponent],
            providers: [
                {provide: injectBrnDialogContext, useValue: {title: 'Test', msg: 'Test message'}},
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AlertDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
