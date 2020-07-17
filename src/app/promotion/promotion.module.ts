import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PromotionRoutingModule } from './promotion-routing.module';
import { ProductsComponent } from './components/products/products.component';
import { PromotionService } from './services/promotion.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CardsModule, InputsModule, ChartsModule, CheckboxModule, DropdownModule, MDBBootstrapModule, ModalModule
} from 'angular-bootstrap-md';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormProductsComponent } from './components/form-products/form-products.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { CurrencyMaskModule } from 'ngx-currency-mask';
import { BreadcrumbComponent } from '../shared/components/breadcrumb/breadcrumb.component';
import { PriceService } from '../shared/services/price.service';
import { ModalSelectionComponent } from '../shared/components/modal/modal-selection/modal-selection.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { InfogeralComponent } from './components/form-step1/infogeral/infogeral.component';
import { DefinitionComponent } from './components/form-step1/definition/definition.component';
import { PeriodComponent } from './components/form-step1/period/period.component';
import { ListingComponent } from './components/listing/listing.component';
import { FormStep1Component } from './components/form-step1/form-step1.component';
import { FormStep2Component } from './components/form-step2/form-step2.component';
import { FormStep3Component } from './components/form-step3/form-step3.component';
import { StepsComponent } from './components/steps/steps.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};
@NgModule({
  declarations: [
    StepsComponent,
    ProductsComponent,
    FormProductsComponent,
    BreadcrumbComponent,
    ModalSelectionComponent,
    InfogeralComponent,
    DefinitionComponent,
    PeriodComponent,
    ListingComponent,
    FormStep1Component,
    FormStep2Component,
    FormStep3Component
  ],
  imports: [
    PromotionRoutingModule,
    CommonModule,
    CardsModule,
    InputsModule,
    ChartsModule,
    CheckboxModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
    CurrencyMaskModule,
    ModalModule,
    AccordionModule.forRoot(),
    NgxMaskModule.forRoot(options),
    MDBBootstrapModule.forRoot(),
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'Não encontrado',
        totalMessage: 'total',
        selectedMessage: 'selecionado'
      }
    })
  ],
  providers: [
    PromotionService,
    PriceService,
  ]
})
export class PromotionModule { }
