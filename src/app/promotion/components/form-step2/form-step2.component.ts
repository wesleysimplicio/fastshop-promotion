import { AuthoritiesPromotion } from './../../../shared/model/authorities/authorities-promotion.model';
import { ComponentNotification } from './../../../shared/component-notification/component-notification.service';
import { Component, OnInit } from '@angular/core';
import { PaymentType } from 'src/app/shared/model/price/payment-type.model';
import { Promotion } from '../../model/promotion.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { User } from 'src/app/shared/model/user/user.model';
import { UserService } from 'src/app/shared/model/user/user.service';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import { PriceService } from 'src/app/shared/services/price.service';
import { PromotionService } from '../../services/promotion.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionTypeEnum } from '../../enum/promotion-type.enum';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-form-step2',
  templateUrl: './form-step2.component.html',
  styleUrls: ['./form-step2.component.scss']
})
export class FormStep2Component implements OnInit {

  breadcrumbs = [];
  routeId: any;
  search = '';
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
  user = new User();
  typePromo: string;
  isChangeCampaign = false;
  selectsLengthOriginString: string = '[]';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private promotionService: PromotionService,
    private priceService: PriceService,
    private utilValidation: UtilValidation,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private utilities: UtilitiesService,
    private activatePromotion: ComponentNotification
  ) {
    this.promotion = new Promotion();
    this.routeId = this.route.snapshot.params.id;
    if (this.routeId === 'undefined' || !this.routeId) {
      this.toastrService.warning('Ação inválida');
      this.router.navigate(['/promotion/']);
      return;
    }
    this.route.params.subscribe(params => {
      if (params['id'] !== this.routeId) {
        this.routeId = params['id'];
        window.location.reload();
      }
    });
    this.typePromo = this.route.snapshot.params.typePromo;

    //Redireciona para proximo passo se for CUPOM //TODO: REMOVER DEPOIS
    if (this.typePromo === PromotionTypeEnum.Coupon) {
      this.router.navigate(['/promotion/' + this.typePromo + '/step3/' + this.routeId]);
    }
    this.search = window.localStorage.getItem('PROMO_SEARCH');

    this.breadcrumbs.push(
      {
        url: '/promotion',
        label: 'Promoção'
      },
      {
        url: '/promotion/' + this.typePromo,
        label: 'Vitrine'
      },
      {
        url: '/promotion/' + this.typePromo + '/step1/' + this.routeId,
        label: 'Cadastro'
      },
      {
        url: '',
        label: 'Restrições'
      },
    );
  }

  ngOnInit() {
    this.getAuthoritiesEmmiter();
    this.utilities.showLoading(true);

    this.user = this.userService.getUserLogged();

    this.isEditStep = true;
    this.getPaymentTypePrice();
    this.buildForm();
    this.campaignForm.valueChanges.subscribe(e => {
      this.isChangeCampaign = true;
    });
    this.promotionService.getPromotion(this.routeId).subscribe(
      (res) => {
        this.promotion = res.body;
        if (this.promotion.promotionType !== this.typePromo.toLocaleUpperCase()) {
          this.toastrService.warning('Ação inválida');
          this.router.navigate(['/promotion/' + this.typePromo]);
          return;
        }

        if (this.promotion.paymentTypes && this.promotion.paymentTypes.length > 0) {
          this.showPayment = true;
          this.selecteds = this.promotion.paymentTypes;
          this.selectsLengthOriginString = JSON.stringify(this.promotion.paymentTypes);
        }
        if (this.promotion.campaign || this.promotion.partner) {
          this.showCampaign = true;
        }
        this.buildForm();
        this.utilities.showLoading(false);
      });
  }

  get cF() { return this.campaignForm.controls; }


  buildForm() {
    this.campaignForm = this.formBuilder.group({
      campaign: [this.promotion.campaign], //, Validators.required],
      partner: [this.promotion.partner], //, Validators.required],
      // campaignChannel: [this.promotion.campaignChannel, Validators.required],
    });
  }

  getPaymentTypePrice() {
    this.priceService.getPaymentType().subscribe(
      (res) => {
        this.paymentTypes = res.body;
        // GAMBIARRA PARA TIRAR CARTAO DE CREDITO //TODO: REMOVER
        const removeCreditCard = this.paymentTypes.findIndex(function (node) {
          return node.name === 'Cartão de Crédito';
        });
        this.paymentTypes.splice(removeCreditCard, 1);

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
      // this.campaignForm.get('campaign').setValidators(Validators.required);
      // this.campaignForm.get('partner').setValidators(Validators.required);
      // this.campaignForm.get('campaignChannel').setValidators(Validators.required);
    } else {
      this.showCampaign = false;
      // this.campaignForm.get('campaign').clearValidators();
      // this.campaignForm.get('partner').clearValidators();
      // this.campaignForm.get('campaignChannel').clearValidators();
    }
    this.campaignForm.get('campaign').setValue(null);
    this.campaignForm.get('partner').setValue(null);
    // this.campaignForm.get('campaignChannel').setValue('');
    this.campaignForm.updateValueAndValidity();
    this.campaignForm.markAsDirty();
    this.isChangeCampaign = true;
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


  isChanges() {
    return this.isChangeCampaign || this.isChangeSelectes();
  }

  private isChangeSelectes(): boolean {
    return this.selectsLengthOriginString !== JSON.stringify(this.selecteds);
  }

  onSubmit() {
    //Mexeu em nada, redireciona direto
    if (this.isEditStep && !this.isChanges()) {
      this.router.navigate(['/promotion/' + this.typePromo + '/step3/' + this.routeId]);
      return;
    }

    this.submitted = true;

    if (this.showPayment) {
      this.promotion.paymentTypes = this.selecteds;
    } else {
      this.promotion.paymentTypes = null;
    }

    if (this.showCampaign) {
      if (!this.isFormsValid()) { return; }
    }

    this.utilities.showLoading(true);
    // this.promotion.campaignChannel = this.campaignForm.get('campaignChannel').value;
    this.promotion.campaign = (
      this.campaignForm.get('campaign').value === "" ||
      this.campaignForm.get('campaign').value === null
    ) ? null : this.campaignForm.get('campaign').value;

    this.promotion.partner = (
      this.campaignForm.get('partner').value === "" ||
      this.campaignForm.get('partner').value === null
    ) ? null : this.campaignForm.get('partner').value;

    this.promotion.id = this.routeId;
    this.promotion.updatedBy = this.user.sub;

    this.promotionService.addUpdatePromotion(this.promotion).subscribe(
      (res) => {
        if (this.onlySave) {
          this.router.navigate(['/promotion/' + this.typePromo]);
        } else {
          this.router.navigate(['/promotion/' + this.typePromo + '/step3/' + this.routeId]);
        }
        // this.toastrService.success('Salvo com sucesso');
        this.verifyAuthoritiesMessage(res.body);
        this.utilities.showLoading(false);
      },
      (err: any) => {
        this.utilities.showLoading(false);
        this.submitted = false;
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
      }
    );
  }

  onCancel() {
    this.submitted = false;
    this.router.navigate(['/promotion/' + this.typePromo]);
  }

  onBack() {
    this.router.navigate(['/promotion/' + this.typePromo + '/step1/' + this.routeId]);
  }

  selection(event) {
    this.selecteds = event;
    this.showModalPayment = false;
  }

  remove(index) {
    this.selecteds.splice(index, 1);
  }

  private verifyAuthoritiesMessage(data): void {
    if (data && data.messages && data.messages[0].businessCode < 0) {
      this.toastrService.info(data.messages[0].description);
      return;
    }
    this.toastrService.success(data.messages[0].description);
  }

  returnMock(): any {
    return {
        result: [
            {
              id: '5f578c3c1f7e7e3400c71414',
              name: 'Teste Promo LP Nova 200',
              description: 'LPNova200',
              tag: 'LPN200',
              hierarchy: 99,
              status: 'DISABLE',
              startAt: '2020-09-03T14:34:00',
              discountType: 'PERCENTAGE',
              promotionType: 'OPEN',
              cumulative: false,
              createdBy: 'tlidiojpn',
              createdDate: '2020-09-08T10:50:52.303'
            }
        ],
        messages: [
            {
                businessCode: -1,
                description: 'Promoção criada com sucesso, porém sem permissão para atribuir status Ativa: ',
                attribute: 'Teste Promo LP Nova 200'
            }
        ]
    };

  }

  getAuthoritiesEmmiter(): void {
    this.activatePromotion.getActivatePromotion().pipe(first()).subscribe((res: AuthoritiesPromotion) => {
      this.activatePromotion.setActivatePromotion(res);
    });
  }

}
