import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { ColumnMode, SelectionType, DatatableComponent } from '@swimlane/ngx-datatable';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PromotionService } from 'src/app/promotion/services/promotion.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/model/user/user.service';
import { StatusEnum } from 'src/app/promotion/enum/status.enum';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit, OnChanges {

  rows = [];
  selected = [];
  temp: [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  @Input() breadcrumbs = new Array<IBreadcrumb>();
  search = '';
  searchForm: FormGroup;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
  @Input() strTitlePromo = '';
  @Input() typePromo = '';
  @Input() strNameOfPromo = '';
  @Input() strNewPromo = '';

  constructor(
    private promotionService: PromotionService,
    private toastrService: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.search = window.localStorage.getItem('PROMO_SEARCH');
    this.buildForm();
  }

  ngOnInit() {
    this.getPromotion();
  }

  ngOnChanges() {
    if (this.typePromo !== window.localStorage.getItem('PROMO_SEARCH_TYPE')) {
      window.localStorage.setItem('PROMO_SEARCH', '');
      window.localStorage.setItem('PROMO_SEARCH_TYPE', this.typePromo);
      this.search = '';
      this.buildForm();
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
    this.promotionService.getPromotion('',this.typePromo).subscribe(
      (res) => {
        this.rows = res.body;
        this.temp = res.body;
        if (this.search && this.rows) {
          this.updateFilter(this.search);
        }
      },
      (err: any) => {
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
