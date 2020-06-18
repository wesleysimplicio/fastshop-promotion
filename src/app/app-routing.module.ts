import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './shared/components/errors/error.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'promotion',
    loadChildren: () => import('./promotion/promotion.module').then(m => m.PromotionModule),
  },
  { path: '**', redirectTo: 'error/notfound' },
  { path: 'error/:type', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
