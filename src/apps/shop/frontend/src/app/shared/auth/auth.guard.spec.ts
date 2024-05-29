import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {MockStorageService} from 'src/app/test/mock-local-storage-service';
import {MockRouter} from 'src/app/test/mock-router';

import {AuthGuard} from './auth.guard';
import {AuthService} from './auth.service';

import {StorageService} from '../services/storage.service';

describe('AuthGuard', () => {
    let guard: AuthGuard;
    let mockRouter: MockRouter;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{provide: Router, useValue: mockRouter}, AuthService, {provide: StorageService, useClass: MockStorageService}],
        });
        guard = TestBed.inject(AuthGuard);
    });

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });
});
