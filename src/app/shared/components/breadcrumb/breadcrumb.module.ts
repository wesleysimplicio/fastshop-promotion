import { BreadcrumbRoutingModule } from './breadcrumb-routing.module';
import { BreadcrumbComponent } from './breadcrumb.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        CommonModule,
        BreadcrumbRoutingModule
    ],
    declarations: [ BreadcrumbComponent ],
    exports: [ BreadcrumbComponent ]
})
export class BreadcrumbModule { }