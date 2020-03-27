import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CouponsComponent } from './promotion/coupons/coupons.component';
import { ErrorComponent } from './shared/errors/error.component';
import { HomeComponent } from './home/home.component';
import { FormCouponsComponent } from './promotion/coupons/form-coupons/form-coupons.component';
import { FormOpenComponent } from './promotion/open/form-open/form-open.component';
import { OpenComponent } from './promotion/open/open.component';
import { FormOpenProductsComponent } from './promotion/open/form-open-products/form-open-products.component';
import { LoginComponent } from './login/login.component';
import { OpenProductsComponent } from './promotion/open/open-products/open-products.component';


const routes: Routes = [
  { path: 'promotion/coupons', component: CouponsComponent },
  { path: 'promotion/coupons/add', component: FormCouponsComponent },
  { path: 'promotion/coupons/edit/:id', component: FormCouponsComponent },
  { path: 'promotion/coupons/view/:id', component: FormCouponsComponent },
  { path: 'promotion/open', component: OpenComponent },
  { path: 'promotion/open/add', component: FormOpenComponent },
  { path: 'promotion/open/add/products/:id', component: FormOpenProductsComponent },
  { path: 'promotion/open/edit/:id', component: FormOpenComponent },
  { path: 'promotion/open/products/:id', component: OpenProductsComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: 'error/notfound' },
  { path: 'error/:type', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
