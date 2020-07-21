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
export class DefinitionComponent implements OnInit { //OnChanges

  showCumulative = false;
  showCouponAmount = false;
  strOfPromo = '';
  @Input() definitionForm: FormGroup;
  @Input() submitted = false;
  @Input() promotion = new Promotion();
  @Input() typePromo = '';
  @Output() getForm = new EventEmitter();
  @Output() getFormValid = new EventEmitter();
  @Output() getShowCumulative = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private utilValidation: UtilValidation
  ) { }

  ngOnInit() {
    this.buildForm();
    if (this.promotion) {
      this.validDiscountType(this.promotion.discountType);
      this.definitionForm.get('discountValue').setValue(this.promotion.discountValue);
      if (this.promotion.couponCode) {
        this.definitionForm.get('couponCode').setValue(this.promotion.couponCode);
        this.definitionForm.get('couponCode').setValidators(
          [Validators.required, Validators.minLength(4), Validators.maxLength(16)]);
      }
      if (this.promotion.cumulative) {
        this.showCumulative = true;
      }
      if (this.promotion.couponAmount) {
        this.showCouponAmount = true;
        this.definitionForm.get('couponAmount').setValue(this.promotion.couponAmount);
        this.definitionForm.get('couponAmount').setValidators([Validators.required, Validators.max(100000)]);
      }else{
        this.definitionForm.get('couponAmount').setValue(null);
      }
    }
    this.promoType();
    this.getForm.emit(this.definitionForm);
    this.definitionForm.statusChanges.subscribe(
      result => {
        this.getForm.emit(this.definitionForm);
        this.getFormValid.emit(this.isFormsValid());
      }
    );
  }

  // ngOnChanges() {
  //   this.getFormValid.emit(this.isFormsValid());
  // }

  promoType() {
    if (this.typePromo === PromotionTypeEnum.Coupon) {
      if (this.showCouponAmount) {
        this.definitionForm.get('couponAmount').setValidators([Validators.required, Validators.max(100000)]);
      }
      this.definitionForm.get('couponCode').setValidators(
        [Validators.required, Validators.minLength(4), Validators.maxLength(16)]);
      this.strOfPromo = 'do cupom';
    } else {
      this.definitionForm.get('couponAmount').clearValidators();
      this.definitionForm.get('couponCode').clearValidators();
      this.strOfPromo = 'da promoção';
    }
    this.definitionForm.updateValueAndValidity();
    this.definitionForm.markAsDirty();
  }

  toggleCouponAmount() {
    if (!this.showCouponAmount) {
      this.showCouponAmount = true;
      this.definitionForm.get('couponAmount').setValidators([Validators.required, Validators.max(100000)]);
    } else {
      this.showCouponAmount = false;
      this.definitionForm.get('couponAmount').clearValidators();
    }
    this.definitionForm.get('couponAmount').setValue(null);
    this.definitionForm.updateValueAndValidity();
    this.definitionForm.markAsDirty();
  }

  toggleCumulative() {
    if (!this.showCumulative) {
      this.showCumulative = true;
    } else {
      this.showCumulative = false;
    }
    this.getShowCumulative.emit(this.showCumulative);
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
