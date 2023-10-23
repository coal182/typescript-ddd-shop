import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from 'src/app/shared/auth/auth.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { MockStorageService } from 'src/app/test/mock-local-storage-service';
import { MockUserService } from 'src/app/test/mock-user-service';

import { MockRouter } from '../../test/mock-router';
import { HttpUserService } from '../user-service/http-user.service';
import { PutUserParams } from '../user-service/user.service';

import { UserProfileComponent } from './user-profile.component';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let httpMock: HttpClientTestingModule;

  const mockActivatedRoute = { snapshot: { paramMap: { get: (name: string) => 'r9n16bJtQlpxxrTTThEKn' } } };
  let mockRouter: MockRouter;
  let spyUserService: any;
  let mockUserService: MockUserService;

  beforeEach(async () => {
    mockRouter = new MockRouter();
    mockUserService = new MockUserService();
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [UserProfileComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: HttpUserService, useValue: mockUserService },
        AuthService,
        ValidationService,
        { provide: StorageService, useClass: MockStorageService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    httpMock = fixture.debugElement.injector.get<HttpTestingController>(
      HttpTestingController as Type<HttpTestingController>
    );
    component.userIdFromRoute = 'r9n16bJtQlpxxrTTThEKn';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when user submit the form', () => {
    describe('and fields are not valid', () => {
      beforeEach(async () => {
        initializeComponent();
      });

      it('should not allow submitting the form', async () => {
        const testInvalidProfileForm = {
          firstname: 'jon',
          lastname: 'Doe',
          email: 'test@test.com',
          dateOfBirth: new Date('1991-01-01'),
        };
        component.profileForm.setValue(testInvalidProfileForm);
        //component.profileForm.updateValueAndValidity();
        fixture.detectChanges();

        fixture.debugElement.query(By.css('[data-testid=submit-button]')).nativeElement.click();
        fixture.detectChanges();
        expect(mockUserService.putUser).not.toHaveBeenCalled();
      });
    });

    describe('and fields are valid', () => {
      it('should call UserService with expected params', () => {
        const testqueryParams = { id: 'r9n16bJtQlpxxrTTThEKn' };
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
  async function initializeComponent(): Promise<void> {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }
});
