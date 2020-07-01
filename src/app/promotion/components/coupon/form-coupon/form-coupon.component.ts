import { Component, OnInit } from '@angular/core';
import { } from 'angular-bootstrap-md';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';

@Component({
  selector: 'app-form-coupon',
  templateUrl: './form-coupon.component.html',
  styleUrls: ['./form-coupon.component.scss']
})
export class FormCouponComponent implements OnInit {

  breadcrumbs = new Array<IBreadcrumb>();

  constructor(
  ) {
    this.breadcrumbs.push(
      {
        url: '/promotion',
        label: 'Promoção'
      },
      {
        url: '/promotion/coupon',
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
