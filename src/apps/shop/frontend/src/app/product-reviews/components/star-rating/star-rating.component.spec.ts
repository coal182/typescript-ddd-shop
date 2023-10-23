import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

import { RatingStar, StarRatingComponent } from './star-rating.component';

describe(StarRatingComponent.name, () => {
  let fixture: ComponentFixture<HostTestComponent>;
  let component: HostTestComponent;
  let starRatingComponent: StarRatingComponent;

  beforeEach(initTestingModule);

  it('should create', () => {
    expect(starRatingComponent).toBeTruthy();
  });

  describe('given that it has just been initialised', () => {
    it('should initialize with no star selected', () => {
      expect(starRatingComponent.stars.every((star) => star.active === false)).toBeTrue();
    });
  });

  describe('given user clicks on third star', () => {
    beforeEach(() => {
      fixture.debugElement.query(By.css('[data-test="star-3"]')).nativeElement.click();
      fixture.detectChanges();
    });

    const expectedStars: Array<RatingStar> = [
      {
        rating: 1,
        active: true,
      },
      {
        rating: 2,
        active: true,
      },
      {
        rating: 3,
        active: true,
      },
      {
        rating: 4,
        active: false,
      },
      {
        rating: 5,
        active: false,
      },
    ];
    it('should select from first to third star', () => {
      expect(starRatingComponent.stars).toEqual(expectedStars);
    });

    it('should set the correct value to the control', () => {
      expect(component.myForm.value.rating).toBe(3);
    });
  });

  describe('given user clicks on last star', () => {
    beforeEach(() => {
      fixture.debugElement.query(By.css('[data-test="star-5"]')).nativeElement.click();
      fixture.detectChanges();
    });

    it('should select from first to last star', () => {
      expect(starRatingComponent.stars.every((star) => star.active === true)).toBeTrue();
    });

    it('should set the correct value to the control', () => {
      expect(component.myForm.value.rating).toBe(5);
    });
  });

  describe('given user clicks on reset button', () => {
    beforeEach(() => {
      fixture.debugElement.query(By.css('[data-test="reset-rating"]')).nativeElement.click();
      fixture.detectChanges();
    });

    it('should deselect all the stars', () => {
      expect(starRatingComponent.stars.every((star) => star.active === false)).toBeTrue();
    });

    it('should set the correct value to the control', () => {
      expect(component.myForm.value.rating).toBe(0);
    });
  });

  function initTestingModule() {
    TestBed.configureTestingModule({
      declarations: [HostTestComponent, StarRatingComponent],
      imports: [MatIconModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(HostTestComponent);
    component = fixture.componentInstance;
    starRatingComponent = fixture.debugElement.query(By.directive(StarRatingComponent)).componentInstance;
    fixture.detectChanges();
  }

  @Component({
    template: `
      <form [formGroup]="myForm">
        <star-rating formControlName="rating"></star-rating>
      </form>
    `,
  })
  class HostTestComponent {
    public myForm: FormGroup;

    constructor(private fb: FormBuilder) {
      this.myForm = fb.group({
        rating: new FormControl(0),
      });
    }
  }
});
