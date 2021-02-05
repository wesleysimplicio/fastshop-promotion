import { AuthoritiesPromotion } from './../../../../shared/model/authorities/authorities-promotion.model';
import { ComponentNotification } from './../../../../shared/component-notification/component-notification.service';
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
export class DefinitionComponent implements OnInit {

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
  authoritiesPromotion = new AuthoritiesPromotion();

  constructor(
    private formBuilder: FormBuilder,
    private utilValidation: UtilValidation,
    private activatePromotion: ComponentNotification
  ) { }

  ngOnInit() {
    this.buildForm();
    this.listeningDiscountValueChange();
    if (this.promotion) {
      this.validDiscountType(this.promotion.discountType);
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
      } else {
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


  promoType() {
    if (this.typePromo === PromotionTypeEnum.Coupon) {
      if (this.showCouponAmount) {
        this.definitionForm.get('couponAmount').setValidators([Validators.required, Validators.max(100000)]);
      }
      this.definitionForm.get('couponCode').setValidators([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(16)
      ]);
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
      // console.log('return false definitionForm;');
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
    });

    this.definitionForm.get('discountType').valueChanges.subscribe(e => {
      this.validDiscountType(e);
    });
  }

  validDiscountType(e) {
    this.initListeningDiscountType();
  }

  listeningDiscountValueChange(): void {
    this.definitionForm.get('discountType').valueChanges.subscribe(res => {
      this.authoritiesPromotion.discountType = res;
      this.activatePromotion.setActivatePromotion(this.authoritiesPromotion);
      // console.log('TIPO DE DESCONTO', typeof res, res);
    });
  }

  private initListeningDiscountType(): void {
    this.authoritiesPromotion.discountType = this.definitionForm.get('discountType').value;
    this.activatePromotion.setActivatePromotion(this.authoritiesPromotion);
  }

}
