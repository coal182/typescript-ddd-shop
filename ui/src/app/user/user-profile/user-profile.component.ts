import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StatusCodes } from 'http-status-codes';
import { map, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { ValidationService } from 'src/app/shared/services/validation.service';

import { HttpUserService } from '../user-service/http-user.service';
import { PutUserParams } from '../user-service/user.service';

import { AuthService } from './../../shared/auth/auth.service';
import { User } from './../../shared/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  currentUser: User;
  user$: Observable<User> | undefined;
  userIdFromRoute: string;
  profileForm: FormGroup;
  version: number;
  public isLoading = false;
  public subscribedValidity = 'Unkwown';
  namesRegex = new RegExp(
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
  );
  formattedMessage: string;

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    public authService: AuthService,
    public userService: HttpUserService,
    public readonly validateFormService: ValidationService
  ) {
    this.profileForm = this.fb.group(
      {
        firstname: ['', [Validators.required, Validators.pattern(this.namesRegex)]],
        lastname: [
          '',
          [Validators.required, Validators.pattern(this.namesRegex), Validators.minLength(4), Validators.maxLength(20)],
        ],
        email: ['', [Validators.required, this.validateFormService.emailValidator]],
        dateOfBirth: ['', [Validators.required]],
      },
      { validators: this.mandatoryFieldsValidator('email') }
    );
  }
  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.userIdFromRoute = routeParams.get('id');
    const params = { id: this.userIdFromRoute };
    this.isLoading = true;
    this.get(params);
    this.onChanges();
  }

  onChanges(): void {
    this.profileForm.valueChanges.subscribe((val) => {
      this.formattedMessage = `Hello,
  
      My name is <b>${val.firstname} ${val.lastname}</b>, my email is <b>${val.email}</b>,
  
      and my date of birth is <b>${val.dateOfBirth.toLocaleDateString('en-US')}</b>.`;
    });
  }

  onSubmit(): void {
    this.save();
  }

  get(params): void {
    this.user$ = this.userService.getUser(params).pipe(
      map((data) => data.data),
      tap((pro) => (this.isLoading = false))
    );

    this.user$.subscribe((data) => {
      this.profileForm.reset({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        dateOfBirth: new Date(data.dateOfBirth),
      });
      this.version = data.version;
    });
  }

  save(): void {
    const queryParams = { id: this.userIdFromRoute };
    const params: PutUserParams = {
      id: queryParams.id,
      firstname: this.profileForm.value.firstname,
      lastname: this.profileForm.value.lastname,
      email: this.profileForm.value.email,
      dateOfBirth: this.profileForm.value.dateOfBirth.toISOString().split('T')[0],
      version: this.version,
    };

    this.userService.putUser(params).subscribe({
      next: (data) => {
        /*eslint indent: ["error", 2, {"SwitchCase": 1}]*/
        switch (data.status) {
          case StatusCodes.OK:
            this.version++;
            Swal.fire({
              title: 'Success',
              text: 'User updated successfully',
              icon: 'success',
              confirmButtonText: 'OK',
            });
            break;
          case StatusCodes.CONFLICT:
            Swal.fire({
              title: 'Error',
              text: 'There was a version conflict!',
              icon: 'error',
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

      return emptyFields.length === fields.length
        ? { entitiesAreEmpty: 'At least one supported entity must be provided.' }
        : null;
    };
  }
}
