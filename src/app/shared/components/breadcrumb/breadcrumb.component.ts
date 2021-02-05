
import { Component, OnInit, Input } from '@angular/core';
import { IBreadcrumb } from '../../interface/breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})

export class BreadcrumbComponent implements OnInit {

  @Input() breadcrumbs: IBreadcrumb[];

  constructor() {}

  ngOnInit() {
  }

}
