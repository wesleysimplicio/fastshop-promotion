import { Component, OnInit } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';
@Component({
  selector: 'app-open',
  templateUrl: './open.component.html',
  styleUrls: ['./open.component.scss']
})
export class OpenComponent implements OnInit {
 
  breadcrumbs = new Array<IBreadcrumb>();

  constructor(){
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

  ngOnInit(){
    
  }

}

