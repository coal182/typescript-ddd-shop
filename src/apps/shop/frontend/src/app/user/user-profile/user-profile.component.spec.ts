import { provideHttpClientTesting } from '@angular/common/http/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {StorageService} from 'src/app/shared/services/storage.service';
import {ValidationService} from 'src/app/shared/services/validation.service';
import {MockStorageService} from 'src/app/test/mock-local-storage-service';
import {MockUserService} from 'src/app/test/mock-user-service';

import {UserProfileComponent} from './user-profile.component';

import {HttpUserService} from '../user-service/http-user.service';
import {PutUserParams} from '../user-service/user.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('UserProfileComponent', () => {
    let component: UserProfileComponent;
    let fixture: ComponentFixture<UserProfileComponent>;
    const userId = 'user-id';

    let mockUserService: MockUserService;

    beforeEach(async () => {
        mockUserService = new MockUserService();
        await TestBed.configureTestingModule({
    declarations: [UserProfileComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes([])],
    providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (): string => userId } } } },
        { provide: HttpUserService, useValue: mockUserService },
        { provide: StorageService, useClass: MockStorageService },
        ValidationService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
}).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserProfileComponent);
        component = fixture.componentInstance;
        component.userIdFromRoute = userId;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('when user submit the form', () => {
        describe('and fields are not valid', () => {
            it('should not allow submitting the form', async () => {
                const testInvalidProfileForm = {
                    firstname: 'jon',
                    lastname: 'Doe',
                    email: 'test@test.com',
                    dateOfBirth: new Date('1991-01-01'),
                };
                component.profileForm.setValue(testInvalidProfileForm);
                fixture.detectChanges();

                fixture.debugElement.query(By.css('[data-testid=submit-button]')).nativeElement.click();
                fixture.detectChanges();
                expect(mockUserService.putUser).not.toHaveBeenCalled();
            });
        });

        describe('and fields are valid', () => {
            it('should call UserService with expected params', () => {
                const testqueryParams = {id: userId};
                const testProfileForm = {
                    firstname: 'John',
                    lastname: 'Doe',
                    email: 'test@test.com',
                    dateOfBirth: new Date('1991-01-01'),
                };
                const expectedParams: PutUserParams = {
                    id: testqueryParams.id,
                    firstname: testProfileForm.firstname,
                    lastname: testProfileForm.lastname,
                    email: testProfileForm.email,
                    dateOfBirth: testProfileForm.dateOfBirth.toISOString().split('T')[0],
                };
                component.profileForm.setValue(testProfileForm);
                component.onSubmit();
                expect(mockUserService.putUser).toHaveBeenCalledWith(expectedParams);
            });
        });
    });
});
