import { FormGroup } from '@angular/forms';
import { AbstractControl, ValidatorFn } from '@angular/forms';


export class GenericValidator {
    constructor(private validationMessages: ValidationMessages) { }

    processarMensagens(container: FormGroup): { [key: string]: string } {
        let messages: { [key: string]: string } = {};
        for (let controlKey in container.controls) {
            if (container.controls.hasOwnProperty(controlKey)) {
                let c = container.controls[controlKey];

                if (c instanceof FormGroup) {
                    let childMessages = this.processarMensagens(c);
                    Object.assign(messages, childMessages);
                } else {
                    if (this.validationMessages[controlKey]) {
                        messages[controlKey] = '';
                        if ((c.dirty || c.touched) && c.errors) {
                            Object.keys(c.errors).map(messageKey => {
                                if (this.validationMessages[controlKey][messageKey]) {
                                    messages[controlKey] += this.validationMessages[controlKey][messageKey] + '<br />';
                                }
                            });
                        }
                    }
                }
            }
        }
        return messages;
    }
}

export interface DisplayMessage {
    [key: string]: string | any
}
export interface ValidationMessages {
    [key: string]: { [key: string]: string | any}
}

export function passwordStrength(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value;
        if (!value) {
            return null;
        }

        const hasUpperCase = /[A-Z]/.test(value);
        const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const isValidLength = value.length >= min && value.length <= max;

        const passwordValid = hasUpperCase && hasSpecialCharacter && isValidLength;
        return !passwordValid ? { 'passwordStrength': { value: value } } : null;
    };
}

export function matchPasswordValidator(password: string, confirmPassword: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
        const passwordControl = formGroup.get(password);
        const confirmPasswordControl = formGroup.get(confirmPassword);

        if (!passwordControl || !confirmPasswordControl) {
            return null;
        }

        if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
            return null;
        }

        if (passwordControl.value !== confirmPasswordControl.value) {
            confirmPasswordControl.setErrors({ passwordMismatch: true });
        } else {
            confirmPasswordControl.setErrors(null);
        }

        return null;
    };
}
