import { Component, OnInit, Input, Inject } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
