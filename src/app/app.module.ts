import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CouponsComponent } from './promotion/components/coupons/coupons.component';
import {
  WavesModule, ButtonsModule, CardsModule,
  MDBBootstrapModule, InputsModule, CheckboxModule, DropdownModule, ChartsModule
} from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeadersComponent } from './shared/components/headers/headers.component';
import { LoadComponent } from './shared/components/load/load.component';
import { UtilitiesService } from './shared/services/utilities.service';
import { ErrorComponent } from './shared/components/errors/error.component';
import { HomeComponent } from './home/home.component';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { UtilValidation } from './shared/util/util.validation';
import { CurrencyMaskModule } from 'ngx-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ngx-currency-mask/src/currency-mask.config';
import { LoginComponent } from './login/login.component';
import { PromotionModule } from './promotion/promotion.module';
import { JwtIntercerptorService } from './shared/services/jwt-intercerptor.service';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';
import { ModalSelectionComponent } from './shared/components/modal/modal-selection/modal-selection.component';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

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
    HeadersComponent,
    LoadComponent,
    ErrorComponent,
    HomeComponent,
    LoginComponent,
  ],
  imports: [
    PromotionModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }), // ToastrModule added
  ],
  providers: [
    UtilitiesService,
    UtilValidation,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtIntercerptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
