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
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UnauthorizedUserComponent } from './shared/components/unauthorized-user/unauthorized-user.component';
import { BrowserModule } from '@angular/platform-browser';
import { ShowAuthedDirective } from './shared/directives/show-authed.directive';
import { AuthGuardService } from './shared/services/auth-guard.service';

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
    UnauthorizedUserComponent,
    ShowAuthedDirective 
  ],
  imports: [
    AppRoutingModule,
    PromotionModule,
    CommonModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserModule,
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
    CookieService,
    AuthGuardService
  ],
  bootstrap: [AppComponent],
  exports: [
    NgxSpinnerModule
  ]
})
export class AppModule { }
