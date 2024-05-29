import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UntypedFormBuilder} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {provideMockStore} from '@ngrx/store/testing';
import {AuthService} from 'src/app/shared/auth/auth.service';
import {StorageService} from 'src/app/shared/services/storage.service';
import {loginInitialState} from 'src/app/store/login/state/model';
import {MockStorageService} from 'src/app/test/mock-local-storage-service';

import {SigninComponent} from './signin.component';

describe('SigninComponent', () => {
    let component: SigninComponent;
    let fixture: ComponentFixture<SigninComponent>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const formBuilderStub = (): object => ({group: (object): object => ({})});

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
            declarations: [SigninComponent],
            providers: [
                {provide: UntypedFormBuilder, useFactory: formBuilderStub},
                AuthService,
                {provide: StorageService, useClass: MockStorageService},
                provideMockStore({initialState: loginInitialState}),
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SigninComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
