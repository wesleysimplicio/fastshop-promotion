import { AuthoritiesService } from './../../../shared/authorities/authorities.service';
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
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
import { ISearchFilter } from '../../interfaces/ISearchFilter';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit, OnDestroy {

  rows = [];
  selected = [];
  temp: [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  breadcrumbs = new Array<IBreadcrumb>();
  searchFilter: ISearchFilter;
  activeVigency: boolean;

  searchForm: FormGroup;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
  strTitlePromo = '';
  strNameOfPromo = '';
  strNewPromo = '';
  typePromo = '';
  sizeWindow = window.innerWidth;
  private subscriptions: Subscription[] = [];

  constructor(
    private promotionService: PromotionService,
    private toastrService: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private utilities: UtilitiesService,
    private authoritiesService: AuthoritiesService
  ) {
    let promo: string = this.route.snapshot.params.typePromo;
    this.typePromo = (promo !== undefined) ? (promo !== undefined) ? promo.toLocaleLowerCase() : '' : '';
    let subscription = this.route.params.subscribe(params => {
      if (params['typePromo'] !== this.typePromo) {
        this.typePromo = params['typePromo'];
        this.loadTypePromo();
        //this.changeSearch();
        //window.location.reload();
      }
    });
    this.subscriptions.push(subscription);

    this.buildForm();
    // this.activeVigency = this.searchFilter.vigency;
    //this.changeSearch();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
    this.loadTypePromo();
    if (this.searchFilter.search !== '') {
      this.getPromotionFilter();
    } else {
      this.getPromotion();
    }
  }

  toggleSearchBy(event) {
    this.searchFilter.searchBy = event;
    this.searchForm.get('searchBy').patchValue(event);
    window.localStorage.setItem('PROMO_SEARCH_BY', event);
    // this.onSubmitFilter();
    //if (event.target.checked) {
  }

  loadTypeDiscountName(rows) {
    if (rows) {
      rows.forEach(row => {
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
  }

  changeSearch() {
    if (this.typePromo !== window.localStorage.getItem('PROMO_SEARCH_TYPE')) {
      this.resetFilter();
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

      case PromotionTypeEnum.Open:
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


      default:
        this.typePromo = '';
        this.breadcrumbs.push(
          {
            url: '/promotion',
            label: 'Todos'
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
    this.resetFilter();
    this.buildForm();
    this.getPromotion();
  }

  resetFilter() {
    this.typePromo = '';
    this.searchFilter.searchBy = 'NAME';
    this.searchFilter.vigency = false;
    this.searchFilter.active = 'ENABLE';
    window.localStorage.setItem('PROMO_SEARCH_BY', this.searchFilter.searchBy);
    window.localStorage.setItem('PROMO_SEARCH', '');
    window.localStorage.setItem('PROMO_SEARCH_VIGENCY', String(this.searchFilter.vigency));
    window.localStorage.setItem('PROMO_SEARCH_ACTIVE', this.searchFilter.active);
    window.localStorage.setItem('PROMO_SEARCH_TYPE', this.typePromo);
    this.searchFilter.search = '';
    this.searchFilter.type = this.typePromo;
  }

  buildForm() {
    this.searchFilter = {
      searchBy: (window.localStorage.getItem('PROMO_SEARCH_BY')) ? window.localStorage.getItem('PROMO_SEARCH_BY') : 'NAME',
      search: (window.localStorage.getItem('PROMO_SEARCH')) ? window.localStorage.getItem('PROMO_SEARCH') : '',
      vigency: (window.localStorage.getItem('PROMO_SEARCH_VIGENCY')) ? JSON.parse(window.localStorage.getItem('PROMO_SEARCH_VIGENCY')) : false,
      active: (window.localStorage.getItem('PROMO_SEARCH_ACTIVE')) ? window.localStorage.getItem('PROMO_SEARCH_ACTIVE') : 'ENABLE',
      type: (window.localStorage.getItem('PROMO_SEARCH_TYPE')) ? window.localStorage.getItem('PROMO_SEARCH_TYPE') : this.typePromo
    };

    this.searchForm = this.formBuilder.group({
      searchBy: [this.searchFilter.searchBy],
      search: [this.searchFilter.search],
      active: [this.searchFilter.active],
      type: [this.searchFilter.type],
    });
  }


  getPromotionFilter() {
    console.log(`vigency`, this.searchFilter.vigency);

    this.utilities.showLoading(true);
    let subscription = this.promotionService.getAuthorities().pipe(
      tap(res => {
        this.authoritiesService.setAuthorities(res.body.result[0]);
      }),
      concatMap(() => this.promotionService.getPromotionFilter(this.typePromo, this.searchFilter.active, this.searchFilter.vigency, this.searchFilter.search, this.searchFilter.searchBy))
    )
      .subscribe(
        (res) => {
          this.rows = res.body;
          this.loadTypeDiscountName(this.rows);
          this.temp = res.body;
          //if (this.search && this.rows) {
          this.updateFilter(this.searchFilter.search);
          //}
          this.utilities.showLoading(false);

        },
        (err: any) => {
          this.utilities.showLoading(false);
          if (err.error) {
            err.error.messages.forEach(element => {
              this.toastrService.error(element.description);
            });
          }
        }
      );

    this.subscriptions.push(subscription);
  }

  getPromotion() {
    this.utilities.showLoading(true);
    let subscription = this.promotionService.getAuthorities().pipe(
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
          this.updateFilter(this.searchFilter.search);
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

    this.subscriptions.push(subscription);
  }

  updateStatusPromotion(idPromotion, statusPromotion) {
    const status = (statusPromotion === StatusEnum.Active) ? StatusEnum.Desactive : StatusEnum.Active;
    let subscription = this.promotionService.updatePromotionStatus(idPromotion, status).subscribe(
      (res) => {
        if (res.body.messages[0].businessCode === 0) {
          this.toastrService.success(res.body.messages[0].description);
        } else {
          this.toastrService.info(res.body.messages[0].description);
        }
        this.getPromotionFilter();
      },
      (err: any) => {
        err.error.messages.forEach(element => {
          this.toastrService.error(element.description);
        });
      }
    );
    this.subscriptions.push(subscription);
  }

  updateVigency(event) {
    this.searchFilter.vigency = event;
  }

  onSubmitFilter() {
    // this.updateFilter(this.searchForm.get('search').value);
    // this.router.navigate(['/promotion' + this.typePromo]);
    this.searchFilter.searchBy = this.searchForm.get('searchBy').value;
    window.localStorage.setItem('PROMO_SEARCH_BY', this.searchFilter.searchBy);
    this.searchFilter.search = this.searchForm.get('search').value;
    window.localStorage.setItem('PROMO_SEARCH', this.searchFilter.search);
    window.localStorage.setItem('PROMO_SEARCH_VIGENCY', String(this.searchFilter.vigency));
    window.localStorage.setItem('PROMO_SEARCH_ACTIVE', String(this.searchFilter.active));
    this.searchFilter.type = this.typePromo;
    window.localStorage.setItem('PROMO_SEARCH_TYPE', this.typePromo);
    this.getPromotionFilter();
  }

  updateFilter(event) {
    this.utilities.showLoading(true);
    const status = this.searchFilter.active;
    const val = event.toLowerCase();
    const temp = (this.temp) ? this.temp.filter(function (d: any) {
      let resul =
        // d.status.indexOf(status) !== -1 && d.tag && d.tag.toLowerCase().indexOf(val) !== -1
        // || d.status.indexOf(status) !== -1 && d.name.toLowerCase().indexOf(val) !== -1
        d.status.indexOf(status) !== -1; //&& !val;
      return resul;
    }) : null;
    setTimeout(() => {
      this.utilities.showLoading(false);
    }, 400);
    this.rows = temp;
    if (this.table) {
      this.table.offset = 0;
    }
  }

}
