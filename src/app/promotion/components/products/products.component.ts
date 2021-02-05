import { AuthoritiesService } from './../../../shared/authorities/authorities.service';
import { DiscountTypeEnum } from './../../enum/discount-type.enum';
import { Component, OnInit, LOCALE_ID, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PromotionService } from 'src/app/promotion/services/promotion.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Product } from '../../model/product.model';
import { Promotion } from '../../model/promotion.model';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { PromotionTypeEnum } from '../../enum/promotion-type.enum';
import { tap } from 'rxjs/operators';

import { PerfilEnum } from './../../../shared/enum/perfil.enum';
import { Authorities } from './../../../shared/model/authorities/authorities.model';
import { CurrencyPipe } from '@angular/common';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import * as fileSaver from 'file-saver';
import { Subscription } from 'rxjs';

registerLocaleData(localePt, 'pt-BR');

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
})
export class ProductsComponent implements OnInit, OnDestroy {

  nameCoupon: string;
  routeId: any;
  search = '';
  rows = new Array<Product>();
  selected = [];
  productsForm: FormGroup;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  promotion: Promotion;
  breadcrumbs = new Array<IBreadcrumb>();
  typePromo = '';
  txtOfPromo = '';
  perfilGerencial = false;
  discountTypeText: string;
  authorities: Authorities;
  isPercentage = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private promotionService: PromotionService,
    private formBuilder: FormBuilder,
    private utilities: UtilitiesService,
    private authoritiesService: AuthoritiesService
  ) {
    this.routeId = this.route.snapshot.params.id;
    let promo: string = this.route.snapshot.params.typePromo;
    this.typePromo = (promo !== undefined) ? promo.toLocaleLowerCase() : '';

    this.search = window.localStorage.getItem('PROMO_SEARCH');
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
    this.validatePerfil();
    this.loadTypePromo();
    if (!this.routeId) {
      this.toastrService.warning('Ação inválida');
      this.router.navigate(['/promotion/open']);
      return;
    }
    this.getPromotion();
    this.getPromotionProducts();
    this.buildForm();
  }

  loadTypePromo() {
    this.breadcrumbs = [];
    this.breadcrumbs.push(
      {
        url: '/promotion',
        label: 'Promoção'
      },
    );

    switch (this.typePromo) {
      case PromotionTypeEnum.Coupon:
        this.breadcrumbs.push(
          {
            url: '/promotion/coupon',
            label: 'Cupom'
          },
          {
            url: '/promotion/coupon/step1/' + this.routeId,
            label: 'Cadastro'
          },
          {
            url: '',
            label: 'Produtos'
          },
        );
        this.txtOfPromo = 'do cupom';
        break;

      case PromotionTypeEnum.Prime:
        this.breadcrumbs.push(
          {
            url: '/promotion/prime',
            label: 'Prime'
          },
          {
            url: '/promotion/coupon/step1/' + this.routeId,
            label: 'Cadastro'
          },
          {
            url: '',
            label: 'Produtos'
          },
        );
        this.txtOfPromo = 'do cupom';
        break;

      default:
        this.typePromo = 'open';
        this.txtOfPromo = 'da promoção';
        this.breadcrumbs.push(
          {
            url: '/promotion/open',
            label: 'Vitrine'
          },
          {
            url: '/promotion/open/step1/' + this.routeId,
            label: 'Cadastro'
          },
          {
            url: '',
            label: 'Produtos'
          },
        );
        break;
    }
  }

  getPromotion() {
    let subscription = this.promotionService.getPromotion(this.routeId)
      .pipe(
        tap(res => this.getDiscountType(res.body))
      )
      .subscribe(
        (res) => {
          this.promotion = res.body;
        },
        (err: any) => {
          // err.error.messages.forEach(element => {
          //   this.toastrService.error(element.description);
          // });
        }
      );

    this.subscriptions.push(subscription);
  }

  getPromotionProducts() {
    this.utilities.showLoading(true);

    let subscription = this.promotionService.getPromotionProducts(this.routeId).subscribe(
      (res) => {
        res.body.forEach(element => {
          if (element.fixedPrice) {
            element.fixedPrice = element.fixedPrice.toFixed(2);
          }
          if (element.discountValue) {
            element.discountValue = element.discountValue.toFixed(2);
          }
        });
        this.rows = res.body;
        this.utilities.showLoading(false);
      },
      (err: any) => {
        this.utilities.showLoading(false);

        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
      }
    );

    this.subscriptions.push(subscription);
  }

  updateValue(sku, event) {
    let subscription = this.promotionService.updatePromotionPriceProduct(this.routeId, event.replace('R$', ''), sku).subscribe(
      (res) => {
        this.toastrService.success('Preço alterado com sucesso');
        this.getPromotion();
      },
      (err: any) => {
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
      }
    );

    this.subscriptions.push(subscription);
  }

  buildForm() {
    this.productsForm = this.formBuilder.group({
      products: this.formBuilder.array([
        new FormGroup({
          product: new FormControl(''),
        }),
      ])
    });
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    // console.log('Activate Event', event);
  }

  add() {
    this.selected.push(this.rows[1], this.rows[3]);
  }

  update() {
    this.selected = [this.rows[1], this.rows[3]];
  }

  remove() {
    this.selected = [];
  }

  displayCheck(row) {
    return row.name !== 'Ethel Price';
  }

  activateAllProducts(): void {
    const promotion = new Promotion();
    promotion.id = this.routeId;
    let subscription = this.promotionService.activateAllProducts(promotion)
      .subscribe((res: Promotion) => {
        this.getPromotionProducts();
      }, error => {
        console.log(error);
      });
    this.subscriptions.push(subscription);
  }

  private validatePerfil(): void {
    const authorities = this.authoritiesService.getAuthorities();
    this.perfilGerencial = authorities.profileType === PerfilEnum.gerencial;
    // console.log('PEGANDO AUTORIDADE ====>', authorities, this.perfilGerencial);
  }

  private getDiscountType(promotion: Promotion): void {
    if (promotion.discountType === DiscountTypeEnum.Fixed_Price) {
      this.discountTypeText = 'Preço Fixo';
      return;
    }
    if (promotion.discountType === DiscountTypeEnum.Percentage) {
      this.discountTypeText = `Porcentagem Fixa`;
      this.isPercentage = true;
    }
    if (promotion.discountType === DiscountTypeEnum.Fixed_Discount) {
      this.discountTypeText = `Desconto Fixo`;
    }
  }

  downloadFiles() {
    let subscription = this.promotionService.downloadFiles(this.routeId).subscribe(res => {
      console.log(res);
      this.saveFile(res.body, 'Promocao_' + this.promotion.name);
    });
    this.subscriptions.push(subscription);
  }

  saveFile(data: any, filename?: string) {
    const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
    fileSaver.saveAs(blob, filename + '.xlsx');
  }
}
