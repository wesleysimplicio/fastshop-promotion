import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ColumnMode, SelectionType, DatatableComponent } from '@swimlane/ngx-datatable';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PromotionService } from 'src/app/promotion/services/promotion.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/model/user/user.service';
import { StatusEnum } from 'src/app/promotion/enum/status.enum';
import { PromotionTypeEnum } from '../../enum/promotion-type.enum';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

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

  constructor(
    private promotionService: PromotionService,
    private toastrService: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private utilities: UtilitiesService
  ) {
    this.typePromo = this.route.snapshot.params.typePromo;
    this.route.params.subscribe(params => {
      if (params['typePromo'] !== this.typePromo) {
        this.typePromo = params['typePromo'];
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

  changeSearch() {
    if (this.typePromo !== window.localStorage.getItem('PROMO_SEARCH_TYPE')) {
      window.localStorage.setItem('PROMO_SEARCH', '');
      window.localStorage.setItem('PROMO_SEARCH_TYPE', this.typePromo);
      this.search = '';
      this.buildForm();
    }
  }

  loadTypePromo(){
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

    this.promotionService.getPromotion('', this.typePromo).subscribe(
      (res) => {
        this.rows = res.body;
        this.temp = res.body;
        if (this.search && this.rows) {
          this.updateFilter(this.search);
        }
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
        this.toastrService.success('Status alterado com sucesso');
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
    const val = event.toLowerCase();
    // const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d: any) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;

    this.table.offset = 0;
  }


}
