import { AuthoritiesService } from './../../../shared/authorities/authorities.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ColumnMode, SelectionType, DatatableComponent } from '@swimlane/ngx-datatable';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PromotionService } from 'src/app/promotion/services/promotion.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusEnum } from 'src/app/promotion/enum/status.enum';
import { PromotionTypeEnum } from '../../enum/promotion-type.enum';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { concatMap, tap } from 'rxjs/operators';
import { DiscountTypeEnum } from '../../enum/discount-type.enum';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {

  rows = [];
  selected = [];
  temp: [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  breadcrumbs = new Array<IBreadcrumb>();
  search = '';
  searchForm: FormGroup;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
  strTitlePromo = '';
  strNameOfPromo = '';
  strNewPromo = '';
  typePromo = '';
  statusFilter = 'ENABLE';
  sizeWindow = window.innerWidth;

  constructor(
    private promotionService: PromotionService,
    private toastrService: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private utilities: UtilitiesService,
    private authoritiesService: AuthoritiesService
  ) {
    this.typePromo = this.route.snapshot.params.typePromo;
    this.route.params.subscribe(params => {
      if (params['typePromo'] !== this.typePromo) {
        this.typePromo = params['typePromo'];
        this.statusFilter = 'ENABLE';
        this.getPromotion();
        this.loadTypePromo();
        this.changeSearch();
        //window.location.reload();
      }
    });

    this.search = window.localStorage.getItem('PROMO_SEARCH');
    this.buildForm();
    this.changeSearch();
  }

  ngOnInit() {
    this.loadTypePromo();
    this.getPromotion();
  }

  loadTypeDiscountName(rows) {
    rows.forEach( row => {
      switch (row.discountType) {
        case DiscountTypeEnum.Fixed_Discount:
          row.discountTypeTranslation = 'DesFix';
          break;
        case DiscountTypeEnum.Fixed_Price:
          row.discountTypeTranslation = 'PreFix';
          break;
        case DiscountTypeEnum.Percentage:
          row.discountTypeTranslation = '%';
          break;
      }
    });
  }

  changeSearch() {
    if (this.typePromo !== window.localStorage.getItem('PROMO_SEARCH_TYPE')) {
      window.localStorage.setItem('PROMO_SEARCH', '');
      window.localStorage.setItem('PROMO_SEARCH_TYPE', this.typePromo);
      this.search = '';
      this.buildForm();
    }
  }

  loadTypePromo() {
    this.breadcrumbs = [];
    this.breadcrumbs.push(
      {
        url: '',
        label: 'Promoção'
      },
    );
    switch (this.typePromo) {
      case PromotionTypeEnum.Coupon:
        this.breadcrumbs.push(
          {
            url: '/promotion/coupon',
            label: 'Cupom'
          }
        );
        this.strTitlePromo = 'Cupons cadastrados';
        this.strNameOfPromo = "Nome do cupom";
        this.strNewPromo = "Cadastrar novo cupom";
        break;

        case PromotionTypeEnum.Prime:
        this.breadcrumbs.push(
          {
            url: '/promotion/prime',
            label: 'Prime'
          }
        );
        this.strTitlePromo = 'Primes cadastrados';
        this.strNameOfPromo = 'Nome da promoção';
        this.strNewPromo = 'Cadastrar novo prime';
        break;


      default:
        this.typePromo = 'open';
        this.breadcrumbs.push(
          {
            url: '/promotion/open',
            label: 'Vitrine'
          }
        );
        this.strTitlePromo = 'Promoções cadastradas';
        this.strNameOfPromo = "Nome da promoção";
        this.strNewPromo = "Cadastrar nova promoção";
        break;
    }
  }

  cleanData(): void {
    this.searchForm.reset();
    this.searchForm.updateValueAndValidity();
    this.searchForm.markAsTouched();
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      search: [this.search],
    });
  }

  getPromotion() {
    this.utilities.showLoading(true);
    this.promotionService.getAuthorities().pipe(
      tap(res => {
        this.authoritiesService.setAuthorities(res.body.result[0]);
      }),
      concatMap(() => this.promotionService.getPromotion('', this.typePromo))
    )
    .subscribe(
      (res) => {
        this.rows = res.body;
        this.loadTypeDiscountName(this.rows);
        this.temp = res.body;
        //if (this.search && this.rows) {
        this.updateFilter(this.search);
        //}
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

  updateStatusPromotion(idPromotion, statusPromotion) {
    const status = (statusPromotion === StatusEnum.Active) ? StatusEnum.Desactive : StatusEnum.Active;
    this.promotionService.updatePromotionStatus(idPromotion, status).subscribe(
      (res) => {
        if (res.body.messages[0].businessCode === 0) {
          this.toastrService.success(res.body.messages[0].description);
        } else {
          this.toastrService.info(res.body.messages[0].description);
        }
        this.getPromotion();
      },
      (err: any) => {
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
      }
    );
  }
  onSubmit() {
    this.updateFilter(this.searchForm.get('search').value);
    this.router.navigate(['/promotion/' + this.typePromo]);
    window.localStorage.setItem('PROMO_SEARCH', this.searchForm.get('search').value);
    window.localStorage.setItem('PROMO_SEARCH_TYPE', this.typePromo);
  }

  updateFilter(event) {
    this.utilities.showLoading(true);
    const status = this.statusFilter;
    const val = event.toLowerCase();
    // const val = event.target.value.toLowerCase();
    // filter our data
    const temp = (this.temp) ? this.temp.filter(function (d: any) {
      let resul =
        d.status.indexOf(status) !== -1 && d.tag && d.tag.toLowerCase().indexOf(val) !== -1
        || d.status.indexOf(status) !== -1 && d.name.toLowerCase().indexOf(val) !== -1
        || d.status.indexOf(status) !== -1 && !val;
      return resul;
    }) : null;
    setTimeout(() => {
      this.utilities.showLoading(false);
    }, 400);
    // update the rows
    this.rows = temp;
    if (this.table) {
      this.table.offset = 0;
    }
  }

}
