import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PromotionService } from 'src/app/promotion/services/promotion.service';
import { PriceService } from 'src/app/shared/services/price.service';
import { PaymentType } from 'src/app/shared/model/price/payment-type.model';
import { Promotion } from '../../../model/promotion.model';
import { UtilValidation } from 'src/app/shared/util/util.validation';

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
  showCampaign = false;
  paymentTypes = new Array<PaymentType>();
  showModalPayment = false;
  selecteds = [];
  promotion: Promotion;
  submitted = false;
  title = 'Tipos de pagamento';
  campaignForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private promotionService: PromotionService,
    private priceService: PriceService,
    private utilValidation: UtilValidation,
    private formBuilder: FormBuilder
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
    this.buildForm();
    this.promotionService.getPromotion(this.routeId).subscribe(
      (res) => {
        this.promotion = res.body;
        if (this.promotion.paymentTypes && this.promotion.paymentTypes.length > 0) {
          this.showPayment = true;
          this.selecteds = this.promotion.paymentTypes;
        }
        if (this.promotion.campaign || this.promotion.partner) {
          this.showCampaign = true;
        }
        this.buildForm();
      });
  }

  get cF() { return this.campaignForm.controls; }


  buildForm() {
    this.campaignForm = this.formBuilder.group({
      campaign: [this.promotion.campaign, Validators.required],
      partner: [this.promotion.partner, Validators.required],
      // campaignChannel: [this.promotion.campaignChannel, Validators.required],
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

  togglePayment() {
    if (!this.showPayment) {
      this.showPayment = true;
    } else {
      this.showPayment = false;
    }
  }

  toggleCampaign() {
    if (!this.showCampaign) {
      this.showCampaign = true;
      this.campaignForm.get('campaign').setValidators(Validators.required);
      this.campaignForm.get('partner').setValidators(Validators.required);
      // this.campaignForm.get('campaignChannel').setValidators(Validators.required);
    } else {
      this.showCampaign = false;
      this.campaignForm.get('campaign').clearValidators();
      this.campaignForm.get('partner').clearValidators();
      // this.campaignForm.get('campaignChannel').clearValidators();

    }
    this.campaignForm.get('campaign').setValue('');
    this.campaignForm.get('partner').setValue('');
    // this.campaignForm.get('campaignChannel').setValue('');
    this.campaignForm.updateValueAndValidity();
    this.campaignForm.markAsDirty();
  }


  isFormsValid() {
    if (
      !this.campaignForm.valid
    ) {
      this.utilValidation.validateAllFormFields(this.campaignForm);
      this.toastrService.warning('Formulário inválido');
      return false;
    }
    return true;
  }

  onSubmit() {
    this.submitted = true;

    if (this.showPayment || this.showCampaign) {

      if (this.showPayment) {
        this.promotion.paymentTypes = this.selecteds;
      }

      if (this.showCampaign) {
        if (!this.isFormsValid()) { return; }
      }

      this.promotion.campaign = this.campaignForm.get('campaign').value;
      // this.promotion.campaignChannel = this.campaignForm.get('campaignChannel').value;
      this.promotion.partner = this.campaignForm.get('partner').value;

      this.promotion.id = this.routeId;
      this.promotion.updatedBy = 'form@promotion'; // TODO: REMOVER

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
