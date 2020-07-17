
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormProductsComponent } from './components/form-products/form-products.component';
import { ProductsComponent } from './components/products/products.component';
import { ListingComponent } from './components/listing/listing.component';
import { FormStep1Component } from './components/form-step1/form-step1.component';
import { FormStep2Component } from './components/form-step2/form-step2.component';
import { FormStep3Component } from './components/form-step3/form-step3.component';

const routes: Routes = [
    { path: '', component: ListingComponent },
    { path: 'promotion/:typePromo', component: ListingComponent },
    { path: 'promotion/:typePromo/add', component: FormStep1Component },
    { path: 'promotion/:typePromo/step1/:id', component: FormStep1Component },
    { path: 'promotion/:typePromo/step2/:id', component: FormStep2Component },
    { path: 'promotion/:typePromo/step3/:id', component: FormStep3Component },
    { path: 'promotion/:typePromo/form/products/:id', component: FormProductsComponent },
    { path: 'promotion/:typePromo/products/:id', component: ProductsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PromotionRoutingModule { }
