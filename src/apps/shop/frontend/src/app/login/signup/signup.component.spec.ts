import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { StorageService } from 'src/app/shared/services/storage.service';
import { MockStorageService } from 'src/app/test/mock-local-storage-service';
import { MockRouter } from 'src/app/test/mock-router';

import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  const formBuilderStub = () => ({ group: (object) => ({}) });
  let mockRouter: MockRouter;
  let httpMock: HttpClientTestingModule;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SignupComponent],
      providers: [
        { provide: UntypedFormBuilder, useFactory: formBuilderStub },
        { provide: Router, useValue: mockRouter },
        { provide: StorageService, useClass: MockStorageService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    httpMock = fixture.debugElement.injector.get<HttpTestingController>(
      HttpTestingController as Type<HttpTestingController>
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
