import { Component, OnInit } from '@angular/core';
import { } from 'angular-bootstrap-md';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Promotion } from '../../model/promotion.model';

@Component({
  selector: 'app-form-coupons',
  templateUrl: './form-coupons.component.html',
  styleUrls: ['./form-coupons.component.scss']
})
export class FormCouponsComponent implements OnInit {

  showPeriod = true;
  periodForm: FormGroup;
  infoGeralForm: FormGroup;
  routeId: any;
  promotion: Promotion;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public route: ActivatedRoute
  ) {
    this.promotion = new Promotion();
  }

  ngOnInit() {

  }

}
