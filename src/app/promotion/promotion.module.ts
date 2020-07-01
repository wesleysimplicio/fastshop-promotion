import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PromotionRoutingModule } from './promotion-routing.module';
import { FormCouponComponent } from './components/coupon/form-coupon/form-coupon.component';
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
import { CouponComponent } from './components/coupon/coupon.component';
import { FormOpenProductsComponent } from './components/open/form-open-products/form-open-products.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { CurrencyMaskModule } from 'ngx-currency-mask';
import { BreadcrumbComponent } from '../shared/components/breadcrumb/breadcrumb.component';
import { PriceService } from '../shared/services/price.service';
import { ModalSelectionComponent } from '../shared/components/modal/modal-selection/modal-selection.component';
import { FormOpenRestrictionsComponent } from './components/open/form-open-restrictions/form-open-restrictions.component';
import { FormOpenStocksComponent } from './components/open/form-open-stocks/form-open-stocks.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { InfogeralComponent } from './shared/form-step1/infogeral/infogeral/infogeral.component';
import { DefinitionComponent } from './shared/form-step1/definition/definition/definition.component';
import { PeriodComponent } from './shared/form-step1/period/period/period.component';
import { ListingComponent } from './shared/listing/listing.component';
import { FormStep1Component } from './shared/form-step1/form-step1.component';
import { FormStep2Component } from './shared/form-step2/form-step2.component';
import { FormStep3Component } from './shared/form-step3/form-step3.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};
@NgModule({
  declarations: [
    FormCouponComponent,
    FormOpenComponent,
    OpenComponent,
    StepsComponent,
    OpenProductsComponent,
    CouponComponent,
    FormOpenProductsComponent,
    BreadcrumbComponent,
    FormOpenRestrictionsComponent,
    ModalSelectionComponent,
    FormOpenStocksComponent,
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
