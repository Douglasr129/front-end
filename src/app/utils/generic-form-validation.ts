import { FormControl, FormGroup } from '@angular/forms';
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
    [key: string]: { [key: string]: string | any }
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
export function matchPassword(confirmPassword: FormControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (!control.parent) {
            return null;
        }
        const passwordControl = control;
        const confirmPasswordControl = confirmPassword;
        if (!passwordControl || !confirmPasswordControl) {
            return null;
        }
        return passwordControl.value !== confirmPasswordControl.value ? { 'matchPassword': true } : null;
    };
}

export function cpfValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {

        const cpf = control.value.replace(/[^\d]+/g, '');// Remove caracteres não numéricos 
        if (cpf.length !== 11)
            return { 'cpf': true };
        // Verifica se todos os dígitos são iguais 
        if (/^(\d)\1+$/.test(cpf))
            return { 'cpf': true };
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11)
            resto = 0;
        if (resto !== parseInt(cpf.charAt(9)))
            return { 'cpf': true };
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        } resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10)))
            return { 'cpf': true };
        return null;
    };
}
export function cnpjValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const cnpj = control.value.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos 
        if (cnpj.length !== 14)
            return { 'cnpj': true };
        // Verifica se todos os dígitos são iguais 
        if (/^(\d)\1+$/.test(cnpj))
            return { 'cnpj': true };
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0; let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
            if (pos < 2)
                pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado !== parseInt(digitos.charAt(0)))
            return { 'cnpj': true }; tamanho++;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado !== parseInt(digitos.charAt(1)))
            return { 'cnpj': true };
        return null;
    };
}