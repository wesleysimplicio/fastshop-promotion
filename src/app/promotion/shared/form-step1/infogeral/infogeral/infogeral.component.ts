import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { StatusEnum } from 'src/app/promotion/enum/status.enum';
import { Promotion } from 'src/app/promotion/model/promotion.model';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import { PromotionTypeEnum } from 'src/app/promotion/enum/promotion-type.enum';

@Component({
  selector: 'app-infogeral',
  templateUrl: './infogeral.component.html',
  styleUrls: ['./infogeral.component.scss']
})
export class InfogeralComponent implements OnInit, OnChanges {

  activeInfoGeral: boolean;
  strNameOfPromo = '';
  strPromo='';
  @Input() submitted = false;
  @Input() infoGeralForm: FormGroup;
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
      this.activeInfoGeral = (this.promotion.status === StatusEnum.Active) ? true : false;
    }
    this.getForm.emit(this.infoGeralForm);
    this.infoGeralForm.statusChanges.subscribe(
      result => {
        this.getFormValid.emit(this.isFormsValid());
      }
    );
    this.strChanges();
  }

  ngOnChanges() {
    this.getFormValid.emit(this.isFormsValid());
  }

  get igF() { return this.infoGeralForm.controls; }

  strChanges() {
    if (this.typeOfPromo === PromotionTypeEnum.Coupon) {
      this.strNameOfPromo = 'Nome do cupom';
      this.strPromo='Cupom';
    } else {
      this.strNameOfPromo = 'Nome da promoção';
      this.strPromo='Promoção';
    }
  }

  buildForm() {
    this.infoGeralForm = this.formBuilder.group({
      id: [this.promotion.id],
      name: [this.promotion.name, Validators.required],
      hierarchy: [this.promotion.hierarchy, Validators.required],
      status: [this.promotion.status],
      description: [this.promotion.description],
      tag: [this.promotion.tag]
    });
  }

  toggleInfoGeral() {
    (this.promotion.status === StatusEnum.Active) ?
      this.promotion.status = StatusEnum.Desactive : this.promotion.status = StatusEnum.Active;
  }

  isFormsValid() {
    if (
      !this.infoGeralForm.valid
    ) {
      this.utilValidation.validateAllFormFields(this.infoGeralForm);
      console.log('return false infoGeralForm;');
      return false;
    }

    return true;
  }
}
