import { Component, OnInit } from '@angular/core';
import { } from 'angular-bootstrap-md';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';

@Component({
  selector: 'app-form-coupons',
  templateUrl: './form-coupons.component.html',
  styleUrls: ['./form-coupons.component.scss']
})
export class FormCouponsComponent implements OnInit {

  breadcrumbs = new Array<IBreadcrumb>();

  constructor(
  ) {
    this.breadcrumbs.push(
      {
        url: '/promotion',
        label: 'Promoção'
      },
      {
        url: '/promotion/coupons',
        label: 'Cupom'
      },
      {
        url: '',
        label: 'Cadastro'
      },
    );
  }

 
  ngOnInit() {
  
  }
  
}
