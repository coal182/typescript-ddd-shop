import { Component, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { noop } from 'rxjs';

import { NoOp, OnChangeFn } from 'src/app/shared/utils';

type Rating = number;

export interface RatingStar {
  rating: number;
  active: boolean;
}

@Component({
  selector: 'star-rating',
  templateUrl: 'star-rating.component.html',
  styleUrls: ['star-rating.component.css'],
})
export class StarRatingComponent implements ControlValueAccessor {
  private onChange: OnChangeFn<Rating> = noop;
  private onTouched: () => void = noop;

  private rating = 0;

  public get myControl(): NgControl {
    return this.control;
  }

  public get invalid(): boolean {
    return this.control ? this.control.invalid : false;
  }

  public get showError(): boolean {
    if (!this.control) {
      return false;
    }

    const { dirty, touched } = this.control;

    return this.invalid ? dirty || touched : false;
  }

  public get errorMsg(): string {
    const errors = this.control?.errors;
    if (errors?.['min']) {
      return 'You must select at least one star';
    }

    return '';
  }

  public stars: Array<RatingStar> = [
    { rating: 1, active: false },
    { rating: 2, active: false },
    { rating: 3, active: false },
    { rating: 4, active: false },
    { rating: 5, active: false },
  ];

  public constructor(@Self() @Optional() private control: NgControl) {
    this.control.valueAccessor = this;
  }

  public writeValue(data: Rating): void {
    if (!data) {
      this.resetRating();
    }
    this.renderStars({ active: true, rating: data });
    this.rating = data;
  }

  public registerOnChange(fn: OnChangeFn<Rating>): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: NoOp): void {
    this.onTouched = fn;
  }

  public selectRating(selectedStar: RatingStar): void {
    this.rating = selectedStar.rating;
    this.renderStars(selectedStar);
    this.onTouched();
    this.onChange(this.rating);
  }

  private renderStars(selectedStar: RatingStar) {
    this.stars = this.stars.map((star) => {
      if (star.rating <= selectedStar.rating) {
        star.active = true;
      } else {
        star.active = false;
      }
      return star;
    });
  }

  public resetRating() {
    this.rating = 0;
    this.stars = this.stars.map((star) => ({ ...star, active: false }));
    this.onTouched();
    this.onChange(this.rating);
  }
}
