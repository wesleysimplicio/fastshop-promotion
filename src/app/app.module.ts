import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HeadersComponent } from './shared/components/headers/headers.component';
import { LoadComponent } from './shared/components/load/load.component';
import { UtilitiesService } from './shared/services/utilities.service';
import { ErrorComponent } from './shared/components/errors/error.component';
import { HomeComponent } from './home/home.component';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IConfig } from 'ngx-mask';
import { UtilValidation } from './shared/util/util.validation';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ngx-currency-mask/src/currency-mask.config';
import { LoginComponent } from './login/login.component';
import { PromotionModule } from './promotion/promotion.module';
import { JwtIntercerptorService } from './shared/services/jwt-intercerptor.service';
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
