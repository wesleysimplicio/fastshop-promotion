import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PromotionService } from 'src/app/promotion/services/promotion.service';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import { PriceService } from 'src/app/shared/services/price.service';
import { PaymentType } from 'src/app/shared/model/price/payment-type.model';
import { Promotion } from '../../../model/promotion.model';

@Component({
  selector: 'app-form-open-restrictions',
  templateUrl: './form-open-restrictions.component.html',
  styleUrls: ['./form-open-restrictions.component.scss']
})
export class FormOpenRestrictionsComponent implements OnInit {

  breadcrumbs = [];
  routeId: any;
  isEditStep = false;
  onlySave: boolean;
  showPayment = false;
  paymentForm: FormGroup;
  paymentTypes = new Array<PaymentType>();
  showModalPayment = false;
  selecteds = [];
  promotion: Promotion;
  submitted = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private utilValidation: UtilValidation,
    private toastrService: ToastrService,
    private promotionService: PromotionService,
    private priceService: PriceService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.promotion = new Promotion();
    this.routeId = this.route.snapshot.params.id;
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
        url: '/promotion/open/edit/' + this.routeId,
        label: 'Cadastro'
      },
      {
        url: '',
        label: 'Restrições'
      },
    );
  }

  ngOnInit() {
    if (!this.routeId) {
      this.toastrService.warning('Ação inválida');
      this.router.navigate(['/promotion/']);
      return;

    }

    this.isEditStep = true;
    this.getPaymentTypePrice();
    this.promotion.updatedBy = 'edileno@fastshop.com.br'; // TODO: REMOVER


    this.buildForm();
    this.promotionService.getPromotion(this.routeId).subscribe(
      (res) => {
        this.promotion = res.body;
        if (this.promotion.paymentType && this.promotion.paymentType.id !== '') {
          this.showPayment = true;
        }
        this.buildForm();
      });


  }

  getPaymentTypePrice() {
    this.priceService.getPaymentType().subscribe(
      (res) => {
        this.paymentTypes = res.body;
        console.log('PaymentType Carregado', this.paymentTypes);
      },
      (err: any) => {
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
        return;
      }
    );
  }

  buildForm() {
    this.paymentForm = this.formBuilder.group({
      paymentType: [(this.promotion.paymentType) ? this.promotion.paymentType.id : null],
    });
  }

  get pF() { return this.paymentForm.controls; }

  togglePayment() {
    if (!this.showPayment) {
      this.showPayment = true;
      this.paymentForm.get('paymentType').setValidators(Validators.required);
    } else {
      this.showPayment = false;
      this.paymentForm.get('paymentType').clearValidators();
    }
    this.paymentForm.get('paymentType').setValue('');
    this.paymentForm.updateValueAndValidity();
    this.paymentForm.markAsDirty();
  }


  isFormsValid() {
    if (
      !this.paymentForm.valid
    ) {
      this.utilValidation.validateAllFormFields(this.paymentForm);
      this.toastrService.warning('Formulário inválido');
      return false;
    }
    return true;
  }


  onSubmit() {
    this.submitted = true;

    if (
      !this.isFormsValid()
    ) {
      return;
    }

    if (this.routeId) {
      this.promotion.id = this.routeId;
    }

    if (this.showPayment) {

      this.promotion.paymentType = { id: this.paymentForm.get('paymentType').value };
      console.log('Enviado', this.promotion);

      this.promotionService.addUpdatePromotion(this.promotion).subscribe(
        (res) => {
          if (this.onlySave) {
            this.router.navigate(['/promotion/open']);
          } else {
            this.router.navigate(['/promotion/open/form/stocks/' + res.body.id]);
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
    } else {
      this.router.navigate(['/promotion/open/form/stocks/' + this.routeId]);
    }

  }

  onCancel() {
    this.submitted = false;
    this.router.navigate(['/promotion/open']);
  }

  onBack() {
    this.router.navigate(['/promotion/open/edit/' + this.routeId]);
  }

  selection(event) {
    console.log(event);

    this.selecteds = event;
    this.showModalPayment = false;
  }

  remove(index) {
    this.selecteds.splice(index, 1);
  }

}
