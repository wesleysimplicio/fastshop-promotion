import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CouponsComponent } from './promotion/coupons/coupons.component';
import {
  WavesModule, ButtonsModule, CardsModule,
  MDBBootstrapModule, InputsModule, CheckboxModule, DropdownModule, ChartsModule
} from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeadersComponent } from './headers/headers.component';
import { LoadComponent } from './shared/load/load.component';
import { UtilitiesService } from './services/utilities.service';
import { ErrorComponent } from './shared/errors/error.component';
import { HomeComponent } from './home/home.component';
import { FormCouponsComponent } from './promotion/coupons/form-coupons/form-coupons.component';
import { FormOpenComponent } from './promotion/open/form-open/form-open.component';
import { OpenComponent } from './promotion/open/open.component';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { UtilValidation } from './shared/util/util.validation';
import { PromotionService } from './services/promotion.service';
import { Environment } from 'src/environments/environment';
import { CurrencyMaskModule } from 'ngx-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ngx-currency-mask/src/currency-mask.config';
import { StepsComponent } from './promotion/steps/steps.component';
import { FormOpenProductsComponent } from './promotion/open/form-open-products/form-open-products.component';
import { LoginComponent } from './login/login.component';
import { OpenProductsComponent } from './promotion/open/open-products/open-products.component';

export let options: Partial<IConfig> | (() => Partial<IConfig>);
export let CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'left',
  allowNegative: false,
  allowZero: false,
  decimal: ',',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: '.'
};
@NgModule({
  declarations: [
    AppComponent,
    CouponsComponent,
    HeadersComponent,
    LoadComponent,
    ErrorComponent,
    HomeComponent,
    FormCouponsComponent,
    FormOpenComponent,
    OpenComponent,
    StepsComponent,
    FormOpenProductsComponent,
    LoginComponent,
    OpenProductsComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    CardsModule,
    InputsModule,
    ChartsModule,
    CheckboxModule,
    DropdownModule,
    CheckboxModule,
    HttpClientModule,
    CurrencyMaskModule,
    NgxMaskModule.forRoot(options),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }), // ToastrModule added
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'Não encontrado',
        totalMessage: 'total',
        selectedMessage: 'selecionado'
      }
    })
  ],
  providers: [
    UtilitiesService,
    UtilValidation,
    PromotionService,
    Environment,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
