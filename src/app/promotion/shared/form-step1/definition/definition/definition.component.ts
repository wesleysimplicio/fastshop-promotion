import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Promotion } from 'src/app/promotion/model/promotion.model';
import { DiscountTypeEnum } from 'src/app/promotion/enum/discount-type.enum';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import { PromotionTypeEnum } from 'src/app/promotion/enum/promotion-type.enum';

@Component({
  selector: 'app-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['./definition.component.scss']
})
export class DefinitionComponent implements OnInit, OnChanges {

  @Input() definitionForm: FormGroup;
  @Input() submitted = false;
  @Input() promotion = new Promotion();
  @Input() typeOfPromo = '';
  @Output() getForm = new EventEmitter();
  @Output() getFormValid = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private utilValidation: UtilValidation
  ) { }

  ngOnInit() {
    this.buildForm();
    if (this.promotion) {
      this.validDiscountType(this.promotion.discountType);
      this.definitionForm.get('discountValue').setValue(this.promotion.discountValue);
      this.definitionForm.get('couponCode').setValue(this.promotion.couponCode);
    }
    this.getForm.emit(this.definitionForm);
    this.definitionForm.statusChanges.subscribe(
      result => {
        this.getFormValid.emit(this.isFormsValid());
      }
    );
    this.promoType();
  }

  ngOnChanges() {
    this.getFormValid.emit(this.isFormsValid());
  }

  promoType() {
    if (this.typeOfPromo === PromotionTypeEnum.Coupon) {
      this.definitionForm.get('couponAmount').setValidators(Validators.required);
      this.definitionForm.get('couponCode').setValidators(Validators.required);
    } else {
      this.definitionForm.get('couponAmount').clearValidators();
      this.definitionForm.get('couponCode').clearValidators();
    }
    this.definitionForm.updateValueAndValidity();
    this.definitionForm.markAsDirty();
  }

  isFormsValid() {
    if (
      !this.definitionForm.valid
    ) {
      this.utilValidation.validateAllFormFields(this.definitionForm);
      console.log('return false definitionForm;');
      return false;
    }
    return true;
  }

  get dF() { return this.definitionForm.controls; }

  buildForm() {
    this.definitionForm = this.formBuilder.group({
      cumulative: [this.promotion.cumulative],
      couponAmount: [this.promotion.couponAmount],
      couponCode: [this.promotion.couponCode],
      discountType: [this.promotion.discountType, Validators.required],
      discountValue: [this.promotion.discountValue, [
        Validators.required,
        Validators.min(1),
      ]],
    });

    this.definitionForm.get('discountType').valueChanges.subscribe(e => {
      this.validDiscountType(e);
    });
  }

  validDiscountType(e) {
    if (e === DiscountTypeEnum.Fixed_Price) {
      this.definitionForm.get('discountValue').clearValidators();
    } else {
      this.definitionForm.get('discountValue').setValidators([Validators.required, Validators.min(1)]);
    }

    this.definitionForm.get('discountValue').setValue(0);
    this.definitionForm.updateValueAndValidity();
    this.definitionForm.markAsDirty();
  }

}
