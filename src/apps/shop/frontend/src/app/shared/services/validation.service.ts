import {Injectable} from '@angular/core';
import {ValidationErrors} from '@angular/forms';

@Injectable()
export class ValidationService {
    constructor() {}

    public getError(name: string, field: any): string {
        if (field.errors) {
            if (field.errors.required) {
                return `Field ${name} is required`;
            } else if (field.errors?.pattern) {
                return `Field ${name} has invalid characters`;
            } else if (field.errors?.invalidEmailAddress) {
                return `Field ${name} has invalid email`;
            }
        }

        return '';
    }

    public getValidatorErrorMessage(validatorName: string, validatorValue?: any): string {
        const config = {
            required: 'Required',
            invalidCreditCard: 'Is invalid credit card number',
            invalidEmailAddress: 'Invalid email address',
            invalidPassword: 'Invalid password. Password must be at least 6 characters long, and contain a number.',
            minlength: `Minimum length ${validatorValue.requiredLength}`,
        };

        return config[validatorName];
    }

    public creditCardValidator(control): ValidationErrors | null {
        // Visa, MasterCard, American Express, Diners Club, Discover, JCB
        if (
            control.value.match(
                /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
            )
        ) {
            return null;
        } else {
            return {invalidCreditCard: true};
        }
    }

    public nameValidator(control): ValidationErrors | null {
        // RFC 2822 compliant regex
        if (control.value.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)) {
            return null;
        } else {
            return {invalidName: true};
        }
    }

    public emailValidator(control): ValidationErrors | null {
        // RFC 2822 compliant regex
        if (
            control.value.match(
                /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
            )
        ) {
            return null;
        } else {
            return {invalidEmailAddress: true};
        }
    }

    public passwordValidator(control): ValidationErrors | null {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        } else {
            return {invalidPassword: true};
        }
    }
}
