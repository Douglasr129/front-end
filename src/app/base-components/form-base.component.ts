import { ElementRef } from '@angular/core';
import { DisplayMessage, GenericValidator, ValidationMessages } from '../utils/generic-form-validation';
import { FormGroup } from '@angular/forms';
import { fromEvent, merge, Observable } from 'rxjs';

export abstract class FormBaseComponent {
    protected displayMessage: DisplayMessage = {};
    protected genericValidator: GenericValidator | any;
    protected validationMessages: ValidationMessages | any;

    public mudancasNaoSalvas: boolean | any;

    protected configurarMensagensValidacaoBase(validationMessages: ValidationMessages) {
        this.genericValidator = new GenericValidator(validationMessages);
    }

    protected configurarValidacaoFormularioBase(
        formInputElements: ElementRef[],
        formGroup: FormGroup) {

        let controlBlurs: Observable<any>[] = formInputElements
            .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

        merge(...controlBlurs).subscribe(() => {
            this.validarFormulario(formGroup)
        });
    }

    protected validarFormulario(formGroup: FormGroup) {
        this.displayMessage = this.genericValidator.processarMensagens(formGroup);
        this.mudancasNaoSalvas = true;
    }
}
