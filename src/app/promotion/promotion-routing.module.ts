

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpenComponent } from './components/open/open.component';
import { CouponsComponent } from './components/coupons/coupons.component';
import { FormCouponsComponent } from './components/coupons/form-coupons/form-coupons.component';
import { FormOpenComponent } from './components/open/form-open/form-open.component';
import { FormOpenProductsComponent } from './components/open/form-open-products/form-open-products.component';
import { OpenProductsComponent } from './components/open/open-products/open-products.component';
import { FormOpenRestrictionsComponent } from './components/open/form-open-restrictions/form-open-restrictions.component';
import { FormOpenStocksComponent } from './components/open/form-open-stocks/form-open-stocks.component';

const routes: Routes = [
    { path: '', component: OpenComponent },
    { path: 'promotion/coupons', component: CouponsComponent },
    { path: 'promotion/coupons/add', component: FormCouponsComponent },
    { path: 'promotion/coupons/edit/:id', component: FormCouponsComponent },
    { path: 'promotion/coupons/view/:id', component: FormCouponsComponent },
    { path: 'promotion/open/add', component: FormOpenComponent },

    { path: 'promotion/open', component: OpenComponent },
    { path: 'promotion/open/:search', component: OpenComponent },
    
    { path: 'promotion/open/edit/:id', component: FormOpenComponent },
    { path: 'promotion/open/edit/:id/:search', component: FormOpenComponent },

    { path: 'promotion/open/form/restrictions/:id', component: FormOpenRestrictionsComponent },
    { path: 'promotion/open/form/restrictions/:id/:search', component: FormOpenRestrictionsComponent },

    { path: 'promotion/open/form/stocks/:id', component: FormOpenStocksComponent },
    { path: 'promotion/open/form/stocks/:id/:search', component: FormOpenStocksComponent },

    { path: 'promotion/open/form/products/:id', component: FormOpenProductsComponent },
    { path: 'promotion/open/form/products/:id/:search', component: FormOpenProductsComponent },

    { path: 'promotion/open/products/:id/:search', component: OpenProductsComponent },
    { path: 'promotion/open/products/:id', component: OpenProductsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PromotionRoutingModule { }
