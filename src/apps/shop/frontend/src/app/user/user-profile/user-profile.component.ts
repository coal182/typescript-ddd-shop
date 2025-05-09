import {AsyncPipe, JsonPipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {AbstractControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {StatusCodes} from 'http-status-codes';
import {map, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {MaterialModule} from 'src/app/shared/material/material.module';
import {ValidationService} from 'src/app/shared/services/validation.service';
import Swal from 'sweetalert2';

import {User} from '../../shared/user';
import {HttpUserService} from '../user-service/http-user.service';
import {PutUserParams} from '../user-service/user.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
    imports: [RouterModule, MaterialModule, ReactiveFormsModule, AsyncPipe, JsonPipe],
})
export class UserProfileComponent implements OnInit {
    currentUser: User;
    user$: Observable<User> | undefined;
    userIdFromRoute: string;
    profileForm: UntypedFormGroup;
    public isLoading = false;
    formattedMessage: string;

    constructor(
        public fb: UntypedFormBuilder,
        private route: ActivatedRoute,
        public userService: HttpUserService,
        public readonly validateFormService: ValidationService,
    ) {
        this.profileForm = this.fb.group(
            {
                firstname: ['', [Validators.required, this.validateFormService.nameValidator]],
                lastname: ['', [Validators.required, this.validateFormService.nameValidator, Validators.minLength(4), Validators.maxLength(20)]],
                email: ['', [Validators.required, this.validateFormService.emailValidator]],
                dateOfBirth: ['', [Validators.required]],
            },
            {validators: this.mandatoryFieldsValidator('email')},
        );
    }
    ngOnInit(): void {
        const routeParams = this.route.snapshot.paramMap;
        this.userIdFromRoute = routeParams.get('id');
        const params = {id: this.userIdFromRoute};
        this.isLoading = true;
        this.get(params);
        this.onChanges();
    }

    onChanges(): void {
        this.profileForm.valueChanges.subscribe((val) => {
            this.formattedMessage = `Hello,
  
      My name is <b>${val.firstname} ${val.lastname}</b>, my email is <b>${val.email}</b>,
  
      and my date of birth is <b>${val.dateOfBirth}</b>.`;
        });
    }

    onSubmit(): void {
        this.save();
    }

    get(params): void {
        this.user$ = this.userService.getUser(params).pipe(
            map((data) => data.data),
            tap(() => (this.isLoading = false)),
        );

        this.user$.subscribe((data) => {
            this.profileForm.reset({
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                dateOfBirth: new Date(data.dateOfBirth),
            });
        });
    }

    save(): void {
        const queryParams = {id: this.userIdFromRoute};
        const params: PutUserParams = {
            id: queryParams.id,
            firstname: this.profileForm.value.firstname,
            lastname: this.profileForm.value.lastname,
            email: this.profileForm.value.email,
            dateOfBirth: this.profileForm.get('dateOfBirth').value.toISOString().split('T')[0],
        };

        this.userService.putUser(params).subscribe({
            next: (data) => {
                switch (data.status) {
                    case StatusCodes.OK:
                        Swal.fire({
                            title: 'Success',
                            text: 'User updated successfully',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        });
                        break;
                    case StatusCodes.BAD_REQUEST:
                        Swal.fire({
                            title: 'Error',
                            text: 'User already exists',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        });
                        break;
                    default:
                        Swal.fire({
                            title: 'Error',
                            text: 'There was an error!',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        });
                        break;
                }
            },
            error: (error) => {
                console.error('There was an error!', error);
            },
        });
    }

    private mandatoryFieldsValidator(...fields: Array<string>): ValidatorFn {
        return (form: AbstractControl): ValidationErrors | null => {
            const emptyFields = [];
            for (const field of fields) {
                const control = form.get(field);
                if (!control) {
                    throw new Error(`Field ${field} not found in form`);
                }
                if (!control.value.length) {
                    emptyFields.push(field);
                }
            }

            return emptyFields.length === fields.length ? {entitiesAreEmpty: 'At least one supported entity must be provided.'} : null;
        };
    }
}
