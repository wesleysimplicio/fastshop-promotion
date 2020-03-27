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
    this.routeId = this.route.snapshot.params.id;
    if (this.routeId) {
      // Carrega os dados para pagina
    }
    this.buildForm();
  }

  togglePeriod() {
    (!this.showPeriod) ? this.showPeriod = true : this.showPeriod = false;
  }


  buildForm() {
    this.infoGeralForm = this.formBuilder.group({
      id: [this.promotion.id, Validators.required],
      name: [this.promotion.name, Validators.required],
      hierarchy: [this.promotion.hierarchy, Validators.required],
      status: [this.promotion.status, Validators.required],
      description: [this.promotion.description, Validators.required],
      tag: [this.promotion.tag, Validators.required]
    });
  }

  onSubmit() {
    if (!this.periodForm.valid) {
      window.alert('Formulário inválido');
      return;
    }

  }

}
