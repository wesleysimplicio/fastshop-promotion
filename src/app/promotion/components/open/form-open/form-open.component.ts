import { Component, OnInit } from '@angular/core';
import { MDBModalService, MDBModalRef } from 'angular-bootstrap-md';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Promotion } from '../../../model/promotion.model';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { StatusEnum } from '../../../enum/status.enum';
import { DiscountTypeEnum } from '../../../enum/discount-type.enum';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import { PromotionService } from 'src/app/promotion/services/promotion.service';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';
import { PriceService } from 'src/app/shared/services/price.service';
import { PaymentType } from 'src/app/shared/model/price/payment-type.model';
import { VirtualStore } from 'src/app/shared/model/price/virtual-store.model';
import { Street } from 'src/app/shared/model/price/street.model';

@Component({
  selector: 'app-form-open',
  templateUrl: './form-open.component.html',
  styleUrls: ['./form-open.component.scss']
})
export class FormOpenComponent implements OnInit {

  showPeriod = true;
  infoGeralForm: FormGroup;
  periodForm: FormGroup;
  definitionForm: FormGroup;
  routeId: any;
  promotion: Promotion;
  submitted = false;
  activeInfoGeral: boolean;
  onlySave: boolean;
  showEndAt = true;
  isEditStep = false;
  breadcrumbs = new Array<IBreadcrumb>();
  selecteds = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private utilValidation: UtilValidation,
    private promotionService: PromotionService,
    private priceService: PriceService,
  ) {
    this.breadcrumbs.push(
      {
        url: '/promotion',
        label: 'Promoção'
      },
      {
        url: '/promotion/open',
        label: 'Vitrine'
      },
      {
        url: '',
        label: 'Cadastro'
      },
    );
    this.promotion = new Promotion();
  }

  ngOnInit() {
    this.routeId = this.route.snapshot.params.id;
    if (this.routeId) {
      this.promotionService.getPromotion(this.routeId).subscribe(
        (res) => {
          this.promotion = res.body;
          if (this.promotion) {
            this.buildForm();
            this.validDiscountType(this.promotion.discountType);
            this.definitionForm.get('discountValue').setValue(this.promotion.discountValue);
            this.isEditStep = true;
          }
          // DATE FORMATS
          this.periodForm.get('startAt').setValue(
            moment(this.promotion.startAt, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY HH:mm')
          );
          if (this.promotion.endAt) {
            this.periodForm.get('endAt').setValue(
              moment(this.promotion.endAt, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY HH:mm')
            );
            this.periodForm.markAsDirty();
          } else {
            this.showEndAt = true;
            this.endAtNull();
          }
          this.activeInfoGeral = (this.promotion.status === StatusEnum.Active) ? true : false;
        },
        (err: any) => {
          this.buildForm();
          err.error.messages.forEach(element => {
            this.toastrService.error(element.description);
          });
          return;
        }
      );
    } else {
      this.buildForm();
    }
  }

  selection(data) {
    this.selecteds = data;
    console.log(data);

  }

  toggleInfoGeral() {
    (this.promotion.status === StatusEnum.Active) ?
      this.promotion.status = StatusEnum.Desactive : this.promotion.status = StatusEnum.Active;
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
    this.periodForm.get('startAt').setValue('');
    this.periodForm.get('endAt').setValue('');
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
    this.periodForm.get('endAt').setValue('');
    this.periodForm.updateValueAndValidity();
    this.periodForm.markAsDirty();
  }

  get igF() { return this.infoGeralForm.controls; }
  get pF() { return this.periodForm.controls; }
  get dF() { return this.definitionForm.controls; }

  buildForm() {
    this.infoGeralForm = this.formBuilder.group({
      id: [this.promotion.id],
      name: [this.promotion.name, Validators.required],
      hierarchy: [this.promotion.hierarchy, Validators.required],
      status: [this.promotion.status],
      description: [this.promotion.description],
      tag: [this.promotion.tag, Validators.required]
    });
    this.periodForm = this.formBuilder.group({
      startAt: [this.promotion.startAt, Validators.required],
      endAt: [this.promotion.endAt, Validators.required],
    });

    this.definitionForm = this.formBuilder.group({
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
      this.definitionForm.get('discountValue').setValidators(Validators.required);
    }

    this.definitionForm.get('discountValue').setValue('');
    this.periodForm.updateValueAndValidity();
    this.definitionForm.markAsDirty();
  }

  onSubmit() {
    this.submitted = true;

    if (
      !this.isFormsValid()
    ) {
      return;
    }

    if (this.showPeriod &&
      !this.utilValidation.dateStartEndValidation(
        this.periodForm.get(`startAt`).value,
        this.periodForm.get(`endAt`).value,
        this.showEndAt)
    ) {
      return;
    }

    this.promotion.hierarchy = this.infoGeralForm.get('hierarchy').value;
    this.promotion.name = this.infoGeralForm.get('name').value;
    this.promotion.description = this.infoGeralForm.get('description').value;
    this.promotion.tag = this.infoGeralForm.get('tag').value;
    this.promotion.startAt = (!this.showPeriod) ?
      moment().add(10, 'minutes').format("YYYY-MM-DDTHH:mm:ss").toString() :
      moment(this.periodForm.get('startAt').value, 'DDMMYYYYHHmm').format("YYYY-MM-DDTHH:mm:ss").toString();

    this.promotion.endAt = (!this.showPeriod || !this.showEndAt) ? null : moment(this.periodForm.get('endAt').value, 'DDMMYYYYHHmm').format("YYYY-MM-DDTHH:mm:ss").toString();
    this.promotion.discountType = this.definitionForm.get('discountType').value;
    this.promotion.discountValue = this.definitionForm.get('discountValue').value;
    this.promotion.updatedBy = 'form@promotion'; // TODO: REMOVER
    this.promotion.campaign = null; // TODO: REMOVER

    if (this.routeId) {
      this.promotion.id = this.routeId;
    }

    this.promotionService.addUpdatePromotion(this.promotion).subscribe(
      (res) => {
        if (this.onlySave) {
          this.router.navigate(['/promotion/open']);
        } else {
          this.router.navigate(['/promotion/open/form/restrictions/' + res.body.id]);
        }
        this.toastrService.success('Salvo com sucesso');
      },
      (err: any) => {
        this.submitted = false;
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
      }
    );

  }

  isFormsValid() {
    if (
      !this.infoGeralForm.valid ||
      !this.definitionForm.valid ||
      !this.periodForm.valid
    ) {
      this.utilValidation.validateAllFormFields(this.infoGeralForm);
      this.utilValidation.validateAllFormFields(this.periodForm);
      this.utilValidation.validateAllFormFields(this.definitionForm);
      this.toastrService.warning('Formulário inválido');
      return false;
    }
    return true;
  }

  onCancel() {
    this.submitted = false;
    this.infoGeralForm.reset();
    this.periodForm.reset();
    this.definitionForm.reset();
    this.router.navigate(['/promotion/open']);
  }

}
