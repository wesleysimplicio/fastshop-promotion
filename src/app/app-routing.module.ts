import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CouponsComponent } from './promotion/components/coupons/coupons.component';
import { ErrorComponent } from './shared/components/errors/error.component';
import { HomeComponent } from './home/home.component';
import { FormCouponsComponent } from './promotion/components/coupons/form-coupons/form-coupons.component';
import { FormOpenComponent } from './promotion/components/open/form-open/form-open.component';
import { OpenComponent } from './promotion/components/open/open.component';
import { FormOpenProductsComponent } from './promotion/components/open/form-open-products/form-open-products.component';
import { LoginComponent } from './login/login.component';
import { OpenProductsComponent } from './promotion/components/open/open-products/open-products.component';
import { AuthGuardService } from './shared/services/auth-guard.service';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'auth-callback',
    loadChildren: () => import('./auth-callback/auth-callback.module').then(a => a.AuthCallbackModule)
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'promotion',
    loadChildren: () => import('./promotion/promotion.module').then(m => m.PromotionModule),
    canActivate: [AuthGuardService]
  },
  { path: '**', redirectTo: 'error/notfound' },
  { path: 'error/:type', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
