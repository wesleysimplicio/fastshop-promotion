
import { AuthoritiesService } from './../../../../shared/authorities/authorities.service';
import { Authorities } from './../../../../shared/model/authorities/authorities.model';
import { DiscountTypeEnum } from './../../../enum/discount-type.enum';
import { AuthoritiesPromotion } from './../../../../shared/model/authorities/authorities-promotion.model';
import { ComponentNotification } from './../../../../shared/component-notification/component-notification.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { StatusEnum } from 'src/app/promotion/enum/status.enum';
import { Promotion } from 'src/app/promotion/model/promotion.model';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import { PromotionTypeEnum } from 'src/app/promotion/enum/promotion-type.enum';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-infogeral',
  templateUrl: './infogeral.component.html',
  styleUrls: ['./infogeral.component.scss']
})
export class InfogeralComponent implements OnInit {

  activeInfoGeral: boolean;
  strNameOfPromo = '';
  strPromo = '';
  @Input() submitted = false;
  @Input() infoGeralForm: FormGroup;
  @Input() promotion = new Promotion();
  @Input() typePromo = '';
  @Output() getForm = new EventEmitter();
  @Output() getFormValid = new EventEmitter();
  authorities: Authorities;
  authoritiesEmmiter: AuthoritiesPromotion;
  promotionBlocked = false;
  showBtn = true;
  activePromotionAction = false;

  constructor(
    private formBuilder: FormBuilder,
    private utilValidation: UtilValidation,
    private activatePromotion: ComponentNotification,
    private authoritiesService: AuthoritiesService,
    private toastrService: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getAuthorities();
    this.buildForm();
    this.listeningDiscountValuePromotion();

    if (this.promotion) {
      this.activeInfoGeral = (this.promotion.status === StatusEnum.Active) ? true : false;
    }
    this.strChanges();
    this.getForm.emit(this.infoGeralForm);
    this.infoGeralForm.statusChanges.subscribe(
      result => {
        this.getForm.emit(this.infoGeralForm);
        this.getFormValid.emit(this.isFormsValid());
      }
    );
  }

  get igF() { return this.infoGeralForm.controls; }

  strChanges() {
    if (this.typePromo === PromotionTypeEnum.Coupon) {
      this.strNameOfPromo = 'Nome do cupom';
      this.strPromo = 'Cupom';
      this.infoGeralForm.get('hierarchy').clearValidators();
    } else {
      this.infoGeralForm.get('hierarchy').setValidators(Validators.required);
      this.strNameOfPromo = 'Nome da promoção';
      this.strPromo = 'Promoção';
    }
    this.infoGeralForm.updateValueAndValidity();
    this.infoGeralForm.markAsDirty();
  }

  buildForm() {
    this.infoGeralForm = this.formBuilder.group({
      id: [this.promotion.id],
      name: [this.promotion.name, Validators.required],
      hierarchy: [this.promotion.hierarchy],
      status: [this.promotion.status],
      description: [this.promotion.description],
      tag: [this.promotion.tag],
      activePromotion: [false]
    });
  }


  isFormsValid() {
    if (
      !this.infoGeralForm.valid
    ) {
      this.utilValidation.validateAllFormFields(this.infoGeralForm);
      return false;
    }

    return true;
  }

  private getAuthorities(): void {
    this.authorities = this.authoritiesService.getAuthorities();
  }
  
  private getRoles(discount: string): string {
    switch (discount) {
      case DiscountTypeEnum.Percentage:
        return this.authorities.roles.fixedPercentMaximum;
      case DiscountTypeEnum.Fixed_Discount:
        return this.authorities.roles.fixedDiscountMaximum;
    }
  }

  private listeningDiscountValuePromotion(): void {
    this.activatePromotion.getActivatePromotion()
    .subscribe((res: AuthoritiesPromotion) => {
      this.authoritiesEmmiter = res;
    });
  }

  toggleInfoGeral(event) {
    if (event.target.checked) {
      this.promotion.status = StatusEnum.Active;
    } else {
      this.promotion.status = StatusEnum.Desactive;
    }
  }

}






