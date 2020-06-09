import { Component, OnInit, ViewChild } from '@angular/core';
import { ColumnMode, SelectionType, DatatableComponent } from '@swimlane/ngx-datatable';
import { PromotionService } from 'src/app/promotion/services/promotion.service';
import { ToastrService } from 'ngx-toastr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { StatusEnum } from '../../enum/status.enum';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-open',
  templateUrl: './open.component.html',
  styleUrls: ['./open.component.scss']
})
export class OpenComponent implements OnInit {

  rows = [];
  selected = [];
  temp: [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  breadcrumbs = new Array<IBreadcrumb>();
  search = '';
  searchForm: FormGroup;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  constructor(
    private promotionService: PromotionService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.search = this.route.snapshot.params.search || '';
    this.buildForm();

    this.breadcrumbs.push(
      {
        url: '',
        label: 'Promoção'
      },
      {
        url: '/promotion/open',
        label: 'Vitrine'
      },
    );
  }

  ngOnInit() {
    this.getPromotion();
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
    this.promotionService.getPromotion().subscribe(
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
    this.router.navigate(['/promotion/open/' + this.searchForm.get('search').value]);
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

