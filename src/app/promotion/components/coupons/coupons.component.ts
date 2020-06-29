import { Component, OnInit } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {

  breadcrumbs = new Array<IBreadcrumb>();

  constructor() {
    this.breadcrumbs.push(
      {
        url: '',
        label: 'Promoção'
      },
      {
        url: '/promotion/coupons',
        label: 'Cupom'
      },
    );
  }

  ngOnInit() {
  }

}

