import { Component, OnInit, Input, OnChanges, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Promotion } from 'src/app/promotion/model/promotion.model';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PromotionService } from 'src/app/promotion/services/promotion.service';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import * as moment from 'moment';
import { PromotionTypeEnum } from '../../enum/promotion-type.enum';
import { Subject, Subscription } from 'rxjs';
import { User } from 'src/app/shared/model/user/user.model';
import { UserService } from 'src/app/shared/model/user/user.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'app-form-step1',
  templateUrl: './form-step1.component.html',
  styleUrls: ['./form-step1.component.scss']
})
export class FormStep1Component implements OnInit, OnDestroy {

  infoGeralForm = new FormGroup({});
  periodForm = new FormGroup({});
  definitionForm = new FormGroup({});
  routeId: any;
  search = '';
  promotion: Promotion;
  submitted = false;
  infoValid = true;
  definitionValid = true;
  periodValid = true;
  onlySave: boolean;
  showEndAt = true;
  showPeriod = false;
  showCumulative = false;
  isEditStep = false;
  selecteds = [];
  breadcrumbs = new Array<IBreadcrumb>();
  typePromo: string;
  user = new User();
  isChangePeriod = false;
  isChangeInfo = false;
  isChangeDefinition = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private utilValidation: UtilValidation,
    private promotionService: PromotionService,
    private userService: UserService,
    private utilities: UtilitiesService
  ) {
    this.routeId = this.route.snapshot.params.id;
    let subscription = this.route.params.subscribe(params => {
      if (params['id'] !== this.routeId) {
        this.routeId = params['id'];
        window.location.reload();
      }
    });
    this.subscriptions.push(subscription);

    this.breadcrumbs.push(
      {
        url: '/promotion',
        label: 'Promoção'
      }
    );
    let promo: string = this.route.snapshot.params.typePromo;
    this.typePromo = (promo !== undefined) ? promo.toLocaleLowerCase() : '';
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
    switch (this.typePromo) {
      case PromotionTypeEnum.Open:
        this.breadcrumbs.push(
          {
            url: '/promotion/open',
            label: 'Vitrine'
          }
        );
        break;

      case PromotionTypeEnum.Coupon:
        this.breadcrumbs.push(
          {
            url: '/promotion/coupon',
            label: 'Cupom'
          }
        );
        break;

      default:
        break;
    }

    this.breadcrumbs.push(
      {
        url: '',
        label: 'Cadastro'
      }
    );

    this.user = this.userService.getUserLogged();

    this.search = window.localStorage.getItem('PROMO_SEARCH');

    if (this.routeId) {
      this.getPromotion();
    } else {
      this.promotion = new Promotion();
    }
  }

  getPromotion() {
    this.utilities.showLoading(true);

    let subscription = this.promotionService.getPromotion(this.routeId).subscribe(
      (res) => {
        this.promotion = res.body;
        if (this.promotion) {
          this.isEditStep = true;
          //Valida se o Cupom realmente é do tipo dele
          if (this.promotion.promotionType !== this.typePromo.toLocaleUpperCase()) {
            this.toastrService.warning('Ação inválida');
            this.router.navigate(['/promotion/']);
            return;
          }
          this.utilities.showLoading(false);
        }
      },
      (err: any) => {
        this.utilities.showLoading(false);
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
        return;
      }
    );

    this.subscriptions.push(subscription);
  }

  selection(data) {
    this.selecteds = data;
  }

  isValidForm(form) {
    let result = true;
    switch (form) {
      case 'info':
        result = this.infoValid;
        break;
      case 'definition':
        result = this.definitionValid;
        break;
      case 'period':
        result = this.periodValid;
        break;

      default:
        break;
    }
    return (result === undefined) ? false : result;
  }

  updateForm(form, event) {
    switch (form) {
      case 'info':
        this.infoGeralForm = event;
        this.infoGeralForm.valueChanges.subscribe(e => {
          this.isChangeInfo = true;
        });
        break;
      case 'definition':
        this.definitionForm = event;
        this.definitionForm.valueChanges.subscribe(e => {
          this.isChangeDefinition = true;
        });
        break;
      case 'period':
        this.periodForm = event;
        this.periodForm.valueChanges.subscribe(e => {
          this.isChangePeriod = true;
        });
        break;
      default:
        break;
    }
  }

  isChanges() {
    // console.log('this.isChangeInfo', this.isChangeInfo);
    // console.log('this.isChangeDefinition', this.isChangeDefinition);
    // console.log('this.isChangePeriod', this.isChangePeriod);

    return (this.isChangePeriod || this.isChangeDefinition || this.isChangeInfo) ? true : false;
  }

  onSubmit() {
    if (this.isEditStep && !this.isChanges() && this.typePromo === PromotionTypeEnum.Prime) {
      this.router.navigate(['/promotion/' + this.typePromo + '/step3/' + this.routeId]);
      return;
    }

    if (this.isEditStep && !this.isChanges()) {
      this.router.navigate(['/promotion/' + this.typePromo + '/step2/' + this.routeId]);
      return;
    }

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
        this.showEndAt,
        this.isEditStep)
    ) {
      return false;
    }
    this.utilities.showLoading(true);

    //INFO GERAL
    if (this.isChangeInfo) {
      this.promotion.hierarchy = this.infoGeralForm.get('hierarchy').value;
      this.promotion.name = this.infoGeralForm.get('name').value;
      this.promotion.description = this.infoGeralForm.get('description').value;
      this.promotion.tag = (
        this.infoGeralForm.get('tag').value === "" ||
        this.infoGeralForm.get('tag').value === null
      ) ? null : this.infoGeralForm.get('tag').value;
    }

    //PERIOD
    if (this.isEditStep) {
      if (this.isChangePeriod) {
        this.promotion.startAt = (!this.showPeriod) ?
          moment().add(1, 'minutes').format("YYYY-MM-DDTHH:mm:ss").toString() :
          moment(this.periodForm.get('startAt').value, 'DDMMYYYYHHmm').format("YYYY-MM-DDTHH:mm:ss").toString();
      }
    } else {
      this.promotion.startAt = (!this.showPeriod) ?
        moment().add(1, 'minutes').format("YYYY-MM-DDTHH:mm:ss").toString() :
        moment(this.periodForm.get('startAt').value, 'DDMMYYYYHHmm').format("YYYY-MM-DDTHH:mm:ss").toString();
    }

    if (!this.showEndAt) {
      this.promotion.endAt = null;
    } else {
      this.promotion.endAt = (this.periodForm.get('endAt').value !== null) ? moment(this.periodForm.get('endAt').value, 'DDMMYYYYHHmm').format("YYYY-MM-DDTHH:mm:ss").toString() : null;
    }

    //DEFINITION
    if (this.isChangeDefinition) {
      this.promotion.discountType = this.definitionForm.get('discountType').value;
      if (this.definitionForm.get('couponCode').value) {
        this.promotion.couponCode = this.definitionForm.get('couponCode').value.toLocaleUpperCase(); //.replace(/\s/g, "");
      }
      this.promotion.couponAmount = (this.definitionForm.get('couponAmount').value) ? this.definitionForm.get('couponAmount').value : null;
      this.promotion.cumulative = this.showCumulative;
    }

    this.promotion.updatedBy = this.user.sub;
    this.updatePromotionType();

    if (this.routeId) {
      this.promotion.id = this.routeId;
    } else {
      this.promotion.createdBy = this.user.sub;
    }

    let subscription = this.promotionService.addUpdatePromotion(this.promotion).subscribe(
      (res) => {
        if (this.onlySave) {
          this.router.navigate(['/promotion/' + this.typePromo]);
        } else if (this.typePromo === PromotionTypeEnum.Prime) {// Nova condição para PRIME
          this.configStepPrime(res.body);
        } else {
          this.router.navigate(['/promotion/' + this.typePromo + '/step2/' + res.body.result[0].id]);
        }
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

    this.subscriptions.push(subscription);
  }

  private configStepPrime(data: any): void {
    if (data && data.result) {
      this.router.navigate(['/promotion/' + this.typePromo + '/step3/' + data.result[0].id]);
    } else {
      this.router.navigate(['/promotion/' + this.typePromo + '/step3/' + this.routeId]);
    }
  }

  updateFormValid(form, event) {
    let result: boolean;
    switch (form) {
      case 'info':
        this.infoValid = event;
        break;
      case 'definition':
        this.definitionValid = event;
        break;
      case 'period':
        this.periodValid = event;
        break;

      default:
        break;
    }

    return result;
  }

  isFormsValid() {
    console.log('this.infoValid', this.infoValid);
    console.log('this.definitionValid', this.definitionValid);
    console.log('this.periodValid', this.periodValid);
    if (
      !this.infoValid ||
      !this.definitionValid ||
      !this.periodValid
    ) {
      this.toastrService.warning('Formulário inválido');
      return false;
    }

    return true;
  }

  onCancel() {
    this.submitted = false;
    this.router.navigate(['/promotion/']); // + this.typePromo]);
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
    }

  }










  /**
  * @description
  * Método criado para adicionar lógica nova do PRIME
  */
  updatePromotionType() {
    if (this.typePromo === PromotionTypeEnum.Open) {
      this.promotion.promotionType = PromotionTypeEnum.Open.toLocaleUpperCase();
      return;
    }

    if (this.typePromo === PromotionTypeEnum.Coupon) {
      this.promotion.promotionType = PromotionTypeEnum.Coupon.toLocaleUpperCase();
      return;
    }

    if (this.typePromo === PromotionTypeEnum.Prime) {
      this.promotion.promotionType = PromotionTypeEnum.Prime.toLocaleUpperCase();
      return;
    }
  }



}
