import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PromotionService } from 'src/app/promotion/services/promotion.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Product } from '../../../model/product.model';
import { Promotion } from '../../../model/promotion.model';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';

@Component({
  selector: 'app-open-products',
  templateUrl: './open-products.component.html',
  styleUrls: ['./open-products.component.scss']
})
export class OpenProductsComponent implements OnInit {

  nameCoupon: string;
  routeId: any;
  rows = new Array<Product>();
  selected = [];
  productsForm: FormGroup;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  promotion: Promotion;
  breadcrumbs = new Array<IBreadcrumb>();
  showPrice = false;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private promotionService: PromotionService,
    private formBuilder: FormBuilder,
  ) {
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
        label: 'Produtos'
      },
    );
  }

  ngOnInit() {
    if (!this.routeId) {
      this.toastrService.warning('Ação inválida');
      this.router.navigate(['/promotion/open']);
      return;
    }
    this.getPromotion();
    this.getPromotionProducts();
    this.buildForm();
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
    this.promotionService.getPromotionProducts(this.routeId).subscribe(
      (res) => {
        res.body.forEach(element => {
          if (element.fixedPrice) {
            this.showPrice = true;
            element.fixedPrice = element.fixedPrice.toFixed(2);
          }
        });
        this.rows = res.body;
      },
      (err: any) => {
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
      }
    );
  }

  updateValue(sku, event) {
    console.log('update', sku, event.replace('R$', ''));

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
    console.log('Select Event', selected, this.selected);

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
