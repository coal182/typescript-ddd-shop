import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UserService } from '../user-service/user.service';

import { UserProfileComponent } from './user-profile.component';
import { MockRouter } from '../../test/mock-router';
import { ValidationService } from 'src/app/shared/services/validation.service';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let httpMock: HttpClientTestingModule;
  const formBuilderStub = () => ({
    group: object => ({
      hasError: () => false,
      get: () => {},
    }),
    
  });
  const mockActivatedRoute = { snapshot: { paramMap: {get:(id:number)=>{id:'r9n16bJtQlpxxrTTThEKn'}}}};
  let mockRouter: MockRouter;
    
  
  beforeEach(async () => {
    mockRouter = new MockRouter();
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ UserProfileComponent ],
      providers: [{provide: FormBuilder, useFactory: formBuilderStub}, {provide: ActivatedRoute, useValue: mockActivatedRoute},{ provide: Router, useValue: mockRouter }, AuthService, UserService, ValidationService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    httpMock = fixture.debugElement.injector.get<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
