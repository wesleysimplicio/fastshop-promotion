import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

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
  showPrice = false;
  typePromo = '';
  txtOfPromo = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private promotionService: PromotionService,
    private formBuilder: FormBuilder,
    private utilities: UtilitiesService

  ) {
    this.routeId = this.route.snapshot.params.id;
    this.typePromo = this.route.snapshot.params.typePromo;

    this.search = window.localStorage.getItem('PROMO_SEARCH'); 
  }

  ngOnInit() {
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

  loadTypePromo(){
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
    this.promotionService.getPromotion(this.routeId).subscribe(
      (res) => {
        this.promotion = res.body;
      },
      (err: any) => {
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
      }
    );
  }

  getPromotionProducts() {
    this.utilities.showLoading(true);

    this.promotionService.getPromotionProducts(this.routeId).subscribe(
      (res) => {
        res.body.forEach(element => {
          if (element.fixedPrice) {
            this.showPrice = true;
            element.fixedPrice = element.fixedPrice.toFixed(2);
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
  }

  updateValue(sku, event) {
    this.promotionService.updatePromotionPriceProduct(this.routeId, event.replace('R$', ''), sku).subscribe(
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
    console.log('Activate Event', event);
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

}
