import { OnInit, Component } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/interface/breadcrumb';

@Component({
  selector: 'app-form-open',
  templateUrl: './form-open.component.html',
  styleUrls: ['./form-open.component.scss']
})
export class FormOpenComponent implements OnInit {
  
  breadcrumbs = new Array<IBreadcrumb>();

  constructor() {
    this.breadcrumbs.push(
      {
        url: '/promotion',
        label: 'Promoção'
      },
      {
        url: '/promotion/open',
        label: 'Vitrine'
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
