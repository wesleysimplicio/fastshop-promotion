

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpenComponent } from './components/open/open.component';
import { CouponsComponent } from './components/coupons/coupons.component';
import { FormCouponsComponent } from './components/coupons/form-coupons/form-coupons.component';
import { FormOpenComponent } from './components/open/form-open/form-open.component';
import { FormOpenProductsComponent } from './components/open/form-open-products/form-open-products.component';
import { OpenProductsComponent } from './components/open/open-products/open-products.component';


const routes: Routes = [
    { path: '', component: OpenComponent },
    { path: 'promotion/coupons', component: CouponsComponent },
    { path: 'promotion/coupons/add', component: FormCouponsComponent },
    { path: 'promotion/coupons/edit/:id', component: FormCouponsComponent },
    { path: 'promotion/coupons/view/:id', component: FormCouponsComponent },
    { path: 'promotion/open', component: OpenComponent },
    { path: 'promotion/open/add', component: FormOpenComponent },
    { path: 'promotion/open/add/products/:id', component: FormOpenProductsComponent },
    { path: 'promotion/open/edit/:id', component: FormOpenComponent },
    { path: 'promotion/open/products/:id', component: OpenProductsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PromotionRoutingModule { }
