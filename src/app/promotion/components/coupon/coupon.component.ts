import { Component, OnInit } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {

  breadcrumbs = new Array<IBreadcrumb>();

  constructor() {
    this.breadcrumbs.push(
      {
        url: '',
        label: 'Promoção'
      },
      {
        url: '/promotion/coupon',
        label: 'Cupom'
      },
    );
  }

  ngOnInit() {
  }

}

