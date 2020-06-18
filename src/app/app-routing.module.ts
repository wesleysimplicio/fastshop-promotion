import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './shared/components/errors/error.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { UnauthorizedUserComponent } from './shared/components/unauthorized-user/unauthorized-user.component';

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
    canActivate: [AuthGuardService]
  },
  {
    path: 'promotion',
    loadChildren: () => import('./promotion/promotion.module').then(m => m.PromotionModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'usuario-nao-autorizado',
    component: UnauthorizedUserComponent
  },
  { path: '**', redirectTo: 'error/notfound' },
  { path: 'error/:type', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
