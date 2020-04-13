import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from './shared/services/utilities.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FastShopPromotion';
  public load = false;

  constructor(
    private utilities: UtilitiesService,
  ) {
  }

  ngOnInit() {
    this.utilities.showLoadingSubject.subscribe(val => { this.load = val; });
  }

}
