import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from './../shared/components/breadcrumb/breadcrumb.module';
import { ReportRoutingModule } from './report-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportComponent } from './report.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';

import { CardsModule, InputsModule, MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
    imports: [
        CommonModule,
        ReportRoutingModule,
        BreadcrumbModule,
        CardsModule,
        InputsModule,
        MDBBootstrapModule,
        NgxMaskModule,
        ReactiveFormsModule
    ],
    declarations: [ ReportComponent ]
})
export class ReportModule { }