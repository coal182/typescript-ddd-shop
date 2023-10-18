import { Component, OnInit, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { noop } from 'rxjs';
import { NoOp, OnChangeFn } from 'src/app/shared/utils';

type Rating = number;

interface RatingStar {
    rating: number;
    active: boolean;
}

@Component({
    selector: 'star-rating',
    templateUrl: 'star-rating.component.html',
    styleUrls: ['star-rating.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => StarRatingComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => StarRatingComponent),
            multi: true
        }
    ]
})
export class StarRatingComponent implements OnInit, ControlValueAccessor, Validator {
    private onChange: OnChangeFn<Rating> = noop;
    private onTouched: () => void = noop;

    public rating = 0;

    public stars: Array<RatingStar> = [
        {rating: 1, active: false},
        {rating: 2, active: false},
        {rating: 3, active: false},
        {rating: 4, active: false},
        {rating: 5, active: false}
    ];

    constructor() { }

    public writeValue(data: Rating): void {
        if (!data) {
            this.resetRating();
        }
        this.rating = data;
    }

    public registerOnChange(fn: OnChangeFn<Rating>): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: NoOp): void {
        this.onTouched = fn;
    }

    public validate(control: AbstractControl): ValidationErrors | null {
        const error = control.value !== 0 ? null : {invalidMinimumRating: true};
        return error;
    }

    public ngOnInit() { }

    public selectRating(selectedStar): void{
        this.rating = selectedStar.rating;
        this.stars = this.stars.map(star => {
            if (star.rating <= selectedStar.rating) {
                star.active = true;
            } else {
                star.active = false;
            }
            return star;
        });
        this.onTouched();
        this.onChange(this.rating);
    }

    public resetRating(){
        this.rating = 0;
        this.stars = this.stars.map(star => ({...star, active: false}));
        this.onTouched();
        this.onChange(this.rating);
    }
}