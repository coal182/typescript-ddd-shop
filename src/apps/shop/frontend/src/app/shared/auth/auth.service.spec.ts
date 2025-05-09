import { provideHttpClientTesting } from '@angular/common/http/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {MockStorageService} from 'src/app/test/mock-local-storage-service';
import {MockRouter} from 'src/app/test/mock-router';

import {AuthService} from './auth.service';

import {StorageService} from '../services/storage.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(() => {
        let mockRouter: MockRouter;

        TestBed.configureTestingModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [],
    providers: [
        { provide: Router, useValue: mockRouter },
        { provide: StorageService, useClass: MockStorageService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
}).compileComponents();
        service = TestBed.inject(AuthService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
