import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Promotion } from 'src/app/promotion/model/promotion.model';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PromotionService } from 'src/app/promotion/services/promotion.service';
import { UtilValidation } from 'src/app/shared/util/util.validation';
import { PriceService } from 'src/app/shared/services/price.service';
import * as moment from 'moment';
import { PromotionTypeEnum } from '../../enum/promotion-type.enum';
import { Subject } from 'rxjs';
import { User } from 'src/app/shared/model/user/user.model';
import { UserService } from 'src/app/shared/model/user/user.service';

@Component({
  selector: 'app-form-step1',
  templateUrl: './form-step1.component.html',
  styleUrls: ['./form-step1.component.scss']
})
export class FormStep1Component implements OnInit {

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
  isEditStep = false;
  selecteds = [];
  @Input() breadcrumbs = new Array<IBreadcrumb>();
  @Input() typeOfPromo = '';
  user = new User();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private utilValidation: UtilValidation,
    private promotionService: PromotionService,
    private priceService: PriceService,
    private userService: UserService
  ) {
 
  }

  ngOnInit() {
   this.userService.getUserLoggedSubject().subscribe(res => {
      this.user = res;
    });
    
    this.routeId = this.route.snapshot.params.id;
    this.search = window.localStorage.getItem('PROMO_SEARCH');

    if (this.routeId) {
      this.promotionService.getPromotion(this.routeId).subscribe(
        (res) => {
          this.promotion = res.body;
          if (this.promotion) {
            this.isEditStep = true;

            //Valida se o Cupom realmente é do tipo dele
            if (this.promotion.promotionType !== this.typeOfPromo.toLocaleUpperCase()) {
              this.toastrService.warning('Ação inválida');
              this.router.navigate(['/promotion/']);
              return;
            }

          }
        },
        (err: any) => {
          err.error.messages.forEach(element => {
            this.toastrService.error(element.description);
          });
          return;
        }
      );
    } else {
      this.promotion = new Promotion();
    }
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
        break;
      case 'definition':
        this.definitionForm = event;
        break;
      case 'period':
        this.periodForm = event;
        break;
      default:
        break;
    }
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
        this.showEndAt,
        this.isEditStep)
    ) {
      return;
    }

    this.promotion.hierarchy = this.infoGeralForm.get('hierarchy').value;
    this.promotion.name = this.infoGeralForm.get('name').value;
    this.promotion.description = this.infoGeralForm.get('description').value;
    this.promotion.tag = (
      this.infoGeralForm.get('tag').value === "" ||
      this.infoGeralForm.get('tag').value === null
    ) ? null : this.infoGeralForm.get('tag').value;

    this.promotion.startAt = (!this.showPeriod) ?
      moment().add(10, 'minutes').format("YYYY-MM-DDTHH:mm:ss").toString() :
      moment(this.periodForm.get('startAt').value, 'DDMMYYYYHHmm').format("YYYY-MM-DDTHH:mm:ss").toString();

    this.promotion.endAt = (!this.showPeriod || !this.showEndAt) ? null : moment(this.periodForm.get('endAt').value, 'DDMMYYYYHHmm').format("YYYY-MM-DDTHH:mm:ss").toString();
    this.promotion.discountType = this.definitionForm.get('discountType').value;
    this.promotion.discountValue = this.definitionForm.get('discountValue').value;
    this.promotion.couponCode = this.definitionForm.get('couponCode').value;
    this.promotion.updatedBy = this.user.sub;
    this.promotion.promotionType = (this.typeOfPromo === PromotionTypeEnum.Open)
      ? PromotionTypeEnum.Open.toLocaleUpperCase() : PromotionTypeEnum.Coupon.toLocaleUpperCase();

    if (this.routeId) {
      this.promotion.id = this.routeId;
    }else{
      this.promotion.createdBy = this.user.sub;
    }

    this.promotionService.addUpdatePromotion(this.promotion).subscribe(
      (res) => {
        if (this.onlySave) {
          this.router.navigate(['/promotion/' + this.typeOfPromo]);
        } else {
          this.router.navigate(['/promotion/' + this.typeOfPromo + '/form/restrictions/' + res.body.id]);
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
    if (
      !this.infoValid ||
      !this.definitionValid ||
      !this.periodValid
    ) {
      console.log('this.infoValid', this.infoValid);
      console.log('this.definitionValid', this.definitionValid);
      console.log('this.periodValid', this.periodValid);
      this.toastrService.warning('Formulário inválido');
      return false;
    }

    return true;
  }

  onCancel() {
    this.submitted = false;
    this.router.navigate(['/promotion/' + this.typeOfPromo]);
  }


}
