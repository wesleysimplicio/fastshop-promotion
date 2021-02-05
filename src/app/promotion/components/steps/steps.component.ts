import { Component, OnInit, Input, Inject } from '@angular/core';
import { PromotionTypeEnum } from '../../enum/promotion-type.enum';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})

export class StepsComponent implements OnInit {

  @Input() infoStep = false;
  @Input() definitionStep = false;
  @Input() periodStep = false;
  @Input() productsStep = false;
  @Input() stockStep = false;
  @Input() paymentStep = false;
  @Input() routeId = '';
  @Input() typePromo = '';
  strPromo = '';

  constructor() { }

  ngOnInit() {
    this.strChanges();
  }

  strChanges() {
    if (this.typePromo === PromotionTypeEnum.Coupon) {
      this.strPromo='do cupom';
    } else {
      this.strPromo='da promoção';
    }
  }

}
