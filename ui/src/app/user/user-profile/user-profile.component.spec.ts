import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { PutUserParams, UserService } from '../user-service/user.service';

import { UserProfileComponent } from './user-profile.component';
import { MockRouter } from '../../test/mock-router';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { MockUserService } from 'src/app/test/mock-user-service';
import { HttpUserService } from '../user-service/http-user.service';
import { By } from '@angular/platform-browser';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let httpMock: HttpClientTestingModule;

  const mockActivatedRoute = { snapshot: { paramMap: {get:(name:string)=> 'r9n16bJtQlpxxrTTThEKn'}}};
  let mockRouter: MockRouter;
  let spyUserService: any;
  let mockUserService: MockUserService;
    
  
  beforeEach(async () => {
    mockRouter = new MockRouter();
    mockUserService = new MockUserService();
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [ UserProfileComponent ],
      providers: [{provide: ActivatedRoute, useValue: mockActivatedRoute},{ provide: Router, useValue: mockRouter }, { provide: HttpUserService, useValue: mockUserService }, AuthService, ValidationService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    httpMock = fixture.debugElement.injector.get<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);    
    component.userIdFromRoute = 'r9n16bJtQlpxxrTTThEKn';
    component.version = 1;
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
          console.log("->>>>>>>>>>>>>>>>>>>>>>>>>>>>><");
          console.log(fixture.debugElement.query(By.css('[data-testid=submit-button]')).nativeElement);
          
          fixture.debugElement.query(By.css('[data-testid=submit-button]')).nativeElement.click();
          fixture.detectChanges();
          expect(mockUserService.putUser).not.toHaveBeenCalled();
      });
    }); 

    describe('and fields are valid', () => {

      
        it('should call UserService with expected params', () => {
          const testqueryParams = {id: 'r9n16bJtQlpxxrTTThEKn'};
          const version = 1;
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
            version,
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


