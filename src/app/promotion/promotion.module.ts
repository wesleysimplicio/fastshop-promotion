import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PromotionRoutingModule } from './promotion-routing.module';
import { FormCouponsComponent } from './components/coupons/form-coupons/form-coupons.component';
import { FormOpenComponent } from './components/open/form-open/form-open.component';
import { OpenComponent } from './components/open/open.component';
import { StepsComponent } from './components/steps/steps.component';
import { OpenProductsComponent } from './components/open/open-products/open-products.component';
import { PromotionService } from './services/promotion.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CardsModule, InputsModule, ChartsModule, CheckboxModule, DropdownModule, MDBBootstrapModule, ModalModule
} from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CouponsComponent } from './components/coupons/coupons.component';
import { FormOpenProductsComponent } from './components/open/form-open-products/form-open-products.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { CurrencyMaskModule } from 'ngx-currency-mask';
import { BreadcrumbComponent } from '../shared/components/breadcrumb/breadcrumb.component';
import { PriceService } from '../shared/services/price.service';
import { ShowAuthedDirective } from '../shared/directives/show-authed.directive';
import { ModalSelectionComponent } from '../shared/components/modal/modal-selection/modal-selection.component';
import { FormOpenRestrictionsComponent } from './components/open/form-open-restrictions/form-open-restrictions.component';
import { FormOpenStocksComponent } from './components/open/form-open-stocks/form-open-stocks.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
    FormCouponsComponent,
    FormOpenComponent,
    OpenComponent,
    StepsComponent,
    OpenProductsComponent,
    CouponsComponent,
    FormOpenProductsComponent,
    BreadcrumbComponent,
    ShowAuthedDirective,
    FormOpenRestrictionsComponent,
    ModalSelectionComponent,
    FormOpenStocksComponent
  ],
  imports: [
    PromotionRoutingModule,
    CardsModule,
    InputsModule,
    ChartsModule,
    CheckboxModule,
    DropdownModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    BrowserModule,
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
