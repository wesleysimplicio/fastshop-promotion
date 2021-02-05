import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class UtilValidation {

    constructor(
        private toastrService: ToastrService,
    ) { }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            } else if (control instanceof FormArray) {
                control.controls.forEach((aControl: FormGroup) => {
                    this.validateAllFormFields(aControl);
                });
            }
        });
    }

    dateStartEndValidation(startAt, endAt, showEndAt, isEdit) {

        if (!isEdit && startAt && moment(startAt, 'DDMMYYYYHHmm').toDate() < moment().toDate()) {
            this.toastrService.warning('Data de Início não pode ser menor que data atual');
            return false;
        }

        if (showEndAt) {

            if (!moment(startAt, 'DDMMYYYYHHmm').isValid() || !moment(endAt, 'DDMMYYYYHHmm').isValid()) {
                this.toastrService.warning('Ops, as datas estão inválidas');
                return false;
            }

            if (endAt && moment(startAt, 'DDMMYYYYHHmm').toDate() >= moment(endAt, 'DDMMYYYYHHmm').toDate()) {
                this.toastrService.warning('Data de Início não pode ser maior ou igual que data Término');
                return false;
            }
        }
        return true;
    }

}

