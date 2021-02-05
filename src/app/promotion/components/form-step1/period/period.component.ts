import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Promotion } from 'src/app/promotion/model/promotion.model';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import * as moment from 'moment';
import { PromotionTypeEnum } from 'src/app/promotion/enum/promotion-type.enum';

@Component({
  selector: 'app-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.scss']
})
export class PeriodComponent implements OnInit {

  showPeriod = false;
  showEndAt = true;
  strPromo = '';
  @Input() submitted = false;
  @Input() periodForm: FormGroup;
  @Input() promotion = new Promotion();
  @Input() typePromo = '';
  @Output() getForm = new EventEmitter();
  @Output() getFormValid = new EventEmitter();
  @Output() getShowPeriod = new EventEmitter();
  @Output() getShowEndAt = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private utilValidation: UtilValidation
  ) { }

  ngOnInit() {
    this.buildForm();
    if (this.promotion) {
      // DATE FORMATS
      this.periodForm.get('startAt').setValue(
        moment(this.promotion.startAt, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY HH:mm')
      );
      if (this.promotion.startAt) {
        this.showPeriod = true;
        this.periodForm.get('startAt').setValidators(Validators.required);
      }
      if (this.promotion.endAt) {
        this.periodForm.get('endAt').setValue(
          moment(this.promotion.endAt, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY HH:mm')
        );
        this.periodForm.get('endAt').setValidators(Validators.required);
        this.showEndAt = true;
      } else {
        this.showEndAt = true;
        this.endAtNull();
      }
      this.periodForm.updateValueAndValidity();
      this.periodForm.markAsDirty();
    }
    this.getForm.emit(this.periodForm);
    this.periodForm.statusChanges.subscribe(
      result => {
        this.getFormValid.emit(this.isFormsValid());
        this.getShowPeriod.emit(this.showPeriod);
        this.getShowEndAt.emit(this.showEndAt);
        this.getForm.emit(this.periodForm);
      }
    );
    this.strChanges();
  }

  get pF() { return this.periodForm.controls; }

  strChanges() {
    if (this.typePromo === PromotionTypeEnum.Coupon) {
      this.strPromo='cupom';
    } else {
      this.strPromo='promoção';
    }
  }
  
  buildForm() {
    this.periodForm = this.formBuilder.group({
      startAt: [this.promotion.startAt],
      endAt: [this.promotion.endAt],
    });
  }

  isFormsValid() {
    if (
      !this.periodForm.valid
    ) {
      this.utilValidation.validateAllFormFields(this.periodForm);
      console.log('return false periodForm;');
      return false;
    }
    return true;
  }

  togglePeriod() {
    if (!this.showPeriod) {
      this.showPeriod = true;
      this.periodForm.get('startAt').setValidators(Validators.required);
      this.periodForm.get('endAt').setValidators(Validators.required);
    } else {
      this.showPeriod = false;
      this.periodForm.get('startAt').clearValidators();
      this.periodForm.get('endAt').clearValidators();
    }
    this.periodForm.get('startAt').setValue(null);
    this.periodForm.get('endAt').setValue(null);
    this.periodForm.updateValueAndValidity();
    this.periodForm.markAsDirty();
    this.showEndAt = true;
  }

  endAtNull() {
    if (!this.showEndAt) {
      this.showEndAt = true;
      this.periodForm.get('endAt').setValidators(Validators.required);
    } else {
      this.showEndAt = false;
      this.periodForm.get('endAt').clearValidators();
    }
    this.periodForm.get('endAt').setValue(null);
    this.periodForm.updateValueAndValidity();
    this.periodForm.markAsDirty();
  }

}
